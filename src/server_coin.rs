use chia::clvm_traits::{self, FromClvm, ToClvm};
use chia::clvm_utils::{CurriedProgram, ToTreeHash, TreeHash};
use chia::protocol::{Bytes32, Coin};
use chia_wallet_sdk::{Condition, CreateCoin, DriverError, SpendContext};
use clvmr::NodePtr;
use hex_literal::hex;
use num_bigint::BigInt;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ServerCoin {
    pub coin: Coin,
    pub p2_puzzle_hash: Bytes32,
    pub memo_urls: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, ToClvm, FromClvm)]
#[clvm(curry)]
pub struct MirrorArgs<M> {
    pub morpher: M,
}

impl Default for MirrorArgs<i32> {
    fn default() -> Self {
        Self { morpher: 1 }
    }
}

impl MirrorArgs<i32> {
    pub fn curry_tree_hash() -> TreeHash {
        CurriedProgram {
            program: MIRROR_PUZZLE_HASH,
            args: Self::default(),
        }
        .tree_hash()
    }
}

pub trait MirrorExt {
    fn mirror_puzzle(&mut self) -> Result<NodePtr, DriverError>;
}

impl MirrorExt for SpendContext {
    fn mirror_puzzle(&mut self) -> Result<NodePtr, DriverError> {
        self.puzzle(MIRROR_PUZZLE_HASH, &MIRROR_PUZZLE)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, ToClvm, FromClvm)]
#[clvm(list)]
pub struct MirrorSolution<I, S> {
    pub parent_parent_id: Bytes32,
    pub parent_inner_puzzle: I,
    pub parent_amount: u64,
    pub parent_solution: S,
}

pub const MIRROR_PUZZLE: [u8; 242] = hex!(
    "
    ff02ffff01ff04ffff04ff08ffff04ffff02ff0affff04ff02ffff04ff0bffff
    04ffff02ff05ffff02ff0effff04ff02ffff04ff17ff8080808080ffff04ff2f
    ff808080808080ff808080ffff02ff17ff5f8080ffff04ffff01ffff4720ffff
    02ffff03ffff22ffff09ffff0dff0580ff0c80ffff09ffff0dff0b80ff0c80ff
    ff15ff17ffff0181ff8080ffff01ff0bff05ff0bff1780ffff01ff088080ff01
    80ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff0effff04ff02ff
    ff04ff09ff80808080ffff02ff0effff04ff02ffff04ff0dff8080808080ffff
    01ff0bffff0101ff058080ff0180ff018080
    "
);

pub const MIRROR_PUZZLE_HASH: TreeHash = TreeHash::new(hex!(
    "
    b10ce2d0b18dcf8c21ddfaf55d9b9f0adcbf1e0beb55b1a8b9cad9bbff4e5f22
    "
));

pub fn morph_launcher_id(launcher_id: Bytes32, offset: &BigInt) -> Bytes32 {
    let launcher_id_int = BigInt::from_signed_bytes_be(&launcher_id);
    let morphed_int = launcher_id_int + offset;

    let mut bytes = morphed_int.to_signed_bytes_be();
    if bytes.len() > 32 {
        return Bytes32::default();
    }

    while bytes.len() < 32 {
        bytes.insert(0, 0u8);
    }

    Bytes32::new(bytes.try_into().unwrap())
}

pub fn urls_from_conditions(
    server_coin: &Coin,
    parent_conditions: &[Condition],
) -> Option<Vec<String>> {
    parent_conditions.iter().find_map(|condition| {
        let Condition::CreateCoin(CreateCoin {
            puzzle_hash,
            amount,
            memos,
        }) = condition
        else {
            return None;
        };

        if puzzle_hash != &server_coin.puzzle_hash || *amount != server_coin.amount {
            return None;
        }

        memos
            .iter()
            .skip(1)
            .map(|memo| String::from_utf8(memo.as_ref().to_vec()).ok())
            .collect()
    })
}

#[cfg(test)]
mod tests {
    use chia::clvm_utils::tree_hash;
    use clvmr::{serde::node_from_bytes, Allocator};

    use super::*;

    #[test]
    fn test_puzzle_hash() {
        let mut a = Allocator::new();
        let ptr = node_from_bytes(&mut a, &MIRROR_PUZZLE).unwrap();
        let hash = tree_hash(&a, ptr);
        assert_eq!(MIRROR_PUZZLE_HASH, hash);
    }

    #[test]
    fn test_morph() {
        let mut id = [3u8; 32];
        id[31] = 255;

        let mut expected = id;
        expected[31] = 0;
        expected[30] = 4;

        let actual = morph_launcher_id(id.into(), &1.into());

        assert_eq!(hex::encode(actual), hex::encode(expected));
    }
}
