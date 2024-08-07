/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

/**
 * Represents a coin on the Chia blockchain.
 *
 * @property {Buffer} parentCoinInfo - Parent coin name/id.
 * @property {Buffer} puzzleHash - Puzzle hash.
 * @property {BigInt} amount - Coin amount.
 */
export interface Coin {
  parentCoinInfo: Buffer
  puzzleHash: Buffer
  amount: bigint
}
/**
 * Represents a coin spend on the Chia blockchain.
 *
 * @property {Coin} coin - The coin being spent.
 * @property {Buffer} puzzleReveal - The puzzle of the coin being spent.
 * @property {Buffer} solution - The solution.
 */
export interface CoinSpend {
  coin: Coin
  puzzleReveal: Buffer
  solution: Buffer
}
/**
 * Represents a lineage proof that can be used to spend a singleton.
 *
 * @property {Buffer} parentParentCoinId - Parent coin's parent coin info/name/ID.
 * @property {Buffer} parentInnerPuzzleHash - Parent coin's inner puzzle hash.
 * @property {BigInt} parentAmount - Parent coin's amount.
 */
export interface LineageProof {
  parentParentCoinId: Buffer
  parentInnerPuzzleHash: Buffer
  parentAmount: bigint
}
/**
 * Represents an eve proof that can be used to spend a singleton. Parent coin is the singleton launcher.
 *
 * @property {Buffer} parentCoinInfo - Parent coin's name.
 * @property {BigInt} amount - Parent coin's amount.
 */
export interface EveProof {
  parentCoinInfo: Buffer
  amount: bigint
}
/**
 * Represents a proof (either eve or lineage) that can be used to spend a singleton. Use `new_lineage_proof` or `new_eve_proof` to create a new proof.
 *
 * @property {Option<LineageProof>} lineageProof - The lineage proof, if this is a lineage proof.
 * @property {Option<EveProof>} eveProof - The eve proof, if this is an eve proof.
 */
export interface Proof {
  lineageProof?: LineageProof
  eveProof?: EveProof
}
/**
 * Creates a new lineage proof.
 *
 * @param {LineageProof} lineageProof - The lineage proof.
 * @returns {Proof} The new proof.
 */
export declare function newLineageProof(lineageProof: LineageProof): Proof
/**
 * Creates a new eve proof.
 *
 * @param {EveProof} eveProof - The eve proof.
 * @returns {Proof} The new proof.
 */
export declare function newEveProof(eveProof: EveProof): Proof
/**
 * Represents metadata for a data store.
 *
 * @property {Buffer} rootHash - Root hash.
 * @property {Option<String>} label - Label (optional).
 * @property {Option<String>} description - Description (optional).
 * @property {Option<BigInt>} size - Size of the store (optional).
 */
export interface DataStoreMetadata {
  rootHash: Buffer
  label?: string
  description?: string
  size?: bigint
}
/**
 * Represents information about a delegated puzzle. Note that this struct can represent all three types of delegated puzzles, but only represents one at a time.
 *
 * @property {Option<Buffer>} adminInnerPuzzleHash - Admin inner puzzle hash, if this is an admin delegated puzzle.
 * @property {Option<Buffer>} writerInnerPuzzleHash - Writer inner puzzle hash, if this is a writer delegated puzzle.
 * @property {Option<Buffer>} oraclePaymentPuzzleHash - Oracle payment puzzle hash, if this is an oracle delegated puzzle.
 * @property {Option<BigInt>} oracleFee - Oracle fee, if this is an oracle delegated puzzle.
 */
export interface DelegatedPuzzleInfo {
  adminInnerPuzzleHash?: Buffer
  writerInnerPuzzleHash?: Buffer
  oraclePaymentPuzzleHash?: Buffer
  oracleFee?: bigint
}
/**
 * Represents a delegated puzzle. Note that utilities such as `admin_delegated_puzzle_from_key` should be used to create this object.
 *
 * @property {Buffer} puzzleHash - The full puzzle hash of the delegated puzzle (filter where applicable + inner puzzle).
 * @property {DelegatedPuzzleInfo} puzzleInfo - Delegated puzzle information.
 */
export interface DelegatedPuzzle {
  puzzleHash: Buffer
  puzzleInfo: DelegatedPuzzleInfo
}
/**
 * Represents information about a data store. This information can be used to spend the store. It is recommended that this struct is stored in a database to avoid syncing it every time.
 *
 * @property {Coin} coin - The coin associated with the data store.
 * @property {Buffer} launcherId - The store's launcher/singleton ID.
 * @property {Proof} proof - Proof that can be used to spend this store.
 * @property {DataStoreMetadata} metadata - This store's metadata.
 * @property {Buffer} ownerPuzzleHash - The puzzle hash of the owner puzzle.
 * @property {Vec<DelegatedPuzzle>} delegatedPuzzles - This store's delegated puzzles. An empty list usually indicates a 'vanilla' store.
 */
export interface DataStoreInfo {
  coin: Coin
  launcherId: Buffer
  proof: Proof
  metadata: DataStoreMetadata
  ownerPuzzleHash: Buffer
  delegatedPuzzles: Array<DelegatedPuzzle>
}
/**
 *
 * @property {Vec<CoinSpend>} coinSpends - Coin spends that can be used to spend the provided store.
 * @property {DataStoreInfo} newInfo - New data store information after the spend is confirmed.
 */
export interface SuccessResponse {
  coinSpends: Array<CoinSpend>
  newInfo: DataStoreInfo
}
/**
 * Represents a response from synchronizing a store.
 *
 * @property {DataStoreInfo} latestInfo - Latest data store information.
 * @property {u32} latestHeight - Latest sync height.
 */
export interface SyncStoreResponse {
  latestInfo: DataStoreInfo
  latestHeight: number
}
/**
 * Represents a response containing unspent coins.
 *
 * @property {Vec<Coin>} coins - Unspent coins.
 * @property {u32} lastHeight - Last height.
 * @property {Buffer} lastHeaderHash - Last header hash.
 */
export interface UnspentCoinsResponse {
  coins: Array<Coin>
  lastHeight: number
  lastHeaderHash: Buffer
}
/**
 * Selects coins using the knapsack algorithm.
 *
 * @param {Vec<Coin>} allCoins - Array of available coins (coins to select from).
 * @param {BigInt} totalAmount - Amount needed for the transaction, including fee.
 * @returns {Vec<Coin>} Array of selected coins.
 */
export declare function selectCoins(allCoins: Array<Coin>, totalAmount: bigint): Array<Coin>
/**
 * Mints a new datastore.
 *
 * @param {Buffer} minterSyntheticKey - Minter synthetic key.
 * @param {Vec<Coin>} selectedCoins - Coins to be used for minting, as retured by `select_coins`. Note that, besides the fee, 1 mojo will be used to create the new store.
 * @param {Buffer} rootHash - Root hash of the store.
 * @param {Option<String>} label - Store label (optional).
 * @param {Option<String>} description - Store description (optional).
 * @param {Option<BigInt>} size - Store size (optional).
 * @param {Buffer} ownerPuzzleHash - Owner puzzle hash.
 * @param {Vec<DelegatedPuzzle>} delegatedPuzzles - Delegated puzzles.
 * @param {BigInt} fee - Fee to use for the transaction. Total amount - 1 - fee will be sent back to the minter.
 * @returns {SuccessResponse} The success response, which includes coin spends and information about the new datastore.
 */
export declare function mintStore(minterSyntheticKey: Buffer, selectedCoins: Array<Coin>, rootHash: Buffer, label: string | undefined | null, description: string | undefined | null, size: bigint | undefined | null, ownerPuzzleHash: Buffer, delegatedPuzzles: Array<DelegatedPuzzle>, fee: bigint): SuccessResponse
/**
 * Spends a store in oracle mode.
 *
 * @param {Buffer} spenderSyntheticKey - Spender synthetic key.
 * @param {Vec<Coin>} selectedCoins - Selected coins, as returned by `select_coins`.
 * @param {DataStoreInfo} storeInfo - Up-to-daye store information.
 * @param {BigInt} fee - Transaction fee to use.
 * @returns {SuccessResponse} The success response, which includes coin spends and information about the new datastore.
 */
export declare function oracleSpend(spenderSyntheticKey: Buffer, selectedCoins: Array<Coin>, storeInfo: DataStoreInfo, fee: bigint): SuccessResponse
/**
 * Adds a fee to any transaction. Change will be sent to spender.
 *
 * @param {Buffer} spenderSyntheticKey - Synthetic key of spender.
 * @param {Vec<Coin>} selectedCoins - Selected coins, as returned by `select_coins`.
 * @param {Vec<Buffer>} assertCoinIds - IDs of coins that need to be spent for the fee to be paid. Usually all coin ids in the original transaction.
 * @param {BigInt} fee - Fee to add.
 * @returns {Vec<CoinSpend>} The coin spends to be added to the original transaction.
 */
export declare function addFee(spenderSyntheticKey: Buffer, selectedCoins: Array<Coin>, assertCoinIds: Array<Buffer>, fee: bigint): Array<CoinSpend>
/**
 * Converts a master public key to a wallet synthetic key.
 *
 * @param {Buffer} publicKey - Master public key.
 * @returns {Buffer} The (first) wallet synthetic key.
 */
export declare function masterPublicKeyToWalletSyntheticKey(publicKey: Buffer): Buffer
/**
 * Converts a master public key to the first puzzle hash.
 *
 * @param {Buffer} publicKey - Master public key.
 * @returns {Buffer} The first wallet puzzle hash.
 */
export declare function masterPublicKeyToFirstPuzzleHash(publicKey: Buffer): Buffer
/**
 * Converts a master secret key to a wallet synthetic secret key.
 *
 * @param {Buffer} secretKey - Master secret key.
 * @returns {Buffer} The (first) wallet synthetic secret key.
 */
export declare function masterSecretKeyToWalletSyntheticSecretKey(secretKey: Buffer): Buffer
/**
 * Converts a secret key to its corresponding public key.
 *
 * @param {Buffer} secretKey - The secret key.
 * @returns {Buffer} The public key.
 */
export declare function secretKeyToPublicKey(secretKey: Buffer): Buffer
/**
 * Converts a puzzle hash to an address by encoding it using bech32m.
 *
 * @param {Buffer} puzzleHash - The puzzle hash.
 * @param {String} prefix - Address prefix (e.g., 'txch').
 * @returns {Promise<String>} The converted address.
 */
export declare function puzzleHashToAddress(puzzleHash: Buffer, prefix: string): string
/**
 * Converts an address to a puzzle hash using bech32m.
 *
 * @param {String} address - The address.
 * @returns {Promise<Buffer>} The puzzle hash.
 */
export declare function addressToPuzzleHash(address: string): Buffer
/**
 * Creates an admin delegated puzzle for a given key.
 *
 * @param {Buffer} syntheticKey - Synthetic key.
 * @returns {Promise<DelegatedPuzzle>} The delegated puzzle.
 */
export declare function adminDelegatedPuzzleFromKey(syntheticKey: Buffer): DelegatedPuzzle
/**
 * Creates a writer delegated puzzle from a given key.
 *
 * @param {Buffer} syntheticKey - Synthetic key.
 * /// @returns {Promise<DelegatedPuzzle>} The delegated puzzle.
 */
export declare function writerDelegatedPuzzleFromKey(syntheticKey: Buffer): DelegatedPuzzle
/**
 *
 * @param {Buffer} oraclePuzzleHash - The oracle puzzle hash (corresponding to the wallet where fees should be paid).
 * @param {BigInt} oracleFee - The oracle fee (i.e., XCH amount to be paid for every oracle spend). This amount MUST be even.
 * @returns {Promise<DelegatedPuzzle>} The delegated puzzle.
 */
export declare function oracleDelegatedPuzzle(oraclePuzzleHash: Buffer, oracleFee: bigint): DelegatedPuzzle
/**
 * Partially or fully signs coin spends using a list of keys.
 *
 * @param {Vec<CoinSpend>} coinSpends - The coin spends to sign.
 * @param {Vec<Buffer>} privateKeys - The private/secret keys to be used for signing.
 * @param {Buffer} aggSigData - Aggregated signature data. For testnet11 and mainnet, this is the same as the genesis challenge.
 * @returns {Promise<Buffer>} The signature.
 */
export declare function signCoinSpends(coinSpends: Array<CoinSpend>, privateKeys: Array<Buffer>, aggSigData: Buffer): Buffer
/**
 * Computes the ID (name) of a coin.
 *
 * @param {Coin} coin - The coin.
 * @returns {Buffer} The coin ID.
 */
export declare function getCoinId(coin: Coin): Buffer
/**
 * Updates the metadata of a store. Either the owner, admin, or writer public key must be provided.
 *
 * @param {DataStoreInfo} storeInfo - Current store information.
 * @param {Buffer} newRootHash - New root hash.
 * @param {Option<String>} newLabel - New label (optional).
 * @param {Option<String>} newDescription - New description (optional).
 * @param {Option<BigInt>} newSize - New size (optional).
 * @param {Option<Buffer>} ownerPublicKey - Owner public key.
 * @param {Option<Buffer>} adminPublicKey - Admin public key.
 * @param {Option<Buffer>} writerPublicKey - Writer public key.
 * @returns {SuccessResponse} The success response, which includes coin spends and information about the new datastore.
 */
export declare function updateStoreMetadata(storeInfo: DataStoreInfo, newRootHash: Buffer, newLabel?: string | undefined | null, newDescription?: string | undefined | null, newSize?: bigint | undefined | null, ownerPublicKey?: Buffer | undefined | null, adminPublicKey?: Buffer | undefined | null, writerPublicKey?: Buffer | undefined | null): SuccessResponse
/**
 * Updates the ownership of a store. Either the admin or owner public key must be provided.
 *
 * @param {DataStoreInfo} storeInfo - Store information.
 * @param {Option<Buffer>} newOwnerPuzzleHash - New owner puzzle hash.
 * @param {Vec<DelegatedPuzzle>} newDelegatedPuzzles - New delegated puzzles.
 * @param {Option<Buffer>} ownerPublicKey - Owner public key.
 * @param {Option<Buffer>} adminPublicKey - Admin public key.
 * @returns {SuccessResponse} The success response, which includes coin spends and information about the new datastore.
 */
export declare function updateStoreOwnership(storeInfo: DataStoreInfo, newOwnerPuzzleHash: Buffer | undefined | null, newDelegatedPuzzles: Array<DelegatedPuzzle>, ownerPublicKey?: Buffer | undefined | null, adminPublicKey?: Buffer | undefined | null): SuccessResponse
/**
 * Melts a store. The 1 mojo change will be used as a fee.
 *
 * @param {DataStoreInfo} storeInfo - Store information.
 * @param {Buffer} ownerPublicKey - Owner's public key.
 * @returns {Vec<CoinSpend>} The coin spends that the owner can sign to melt the store.
 */
export declare function meltStore(storeInfo: DataStoreInfo, ownerPublicKey: Buffer): Array<CoinSpend>
export declare class Peer {
  /**
   * Creates a new Peer instance.
   *
   * @param {String} nodeUri - URI of the node (e.g., '127.0.0.1:58444').
   * @param {String} networkId - Network ID (e.g., 'testnet11').
   * @param {String} certPath - Path to the certificate file (usually '~/.chia/mainnet/config/ssl/wallet/wallet_node.crt').
   * @param {String} keyPath - Path to the key file (usually '~/.chia/mainnet/config/ssl/wallet/wallet_node.key').
   * @returns {Promise<Peer>} A new Peer instance.
   */
  static new(nodeUri: string, networkId: string, certPath: string, keyPath: string): Promise<Peer>
  /**
   * Retrieves all coins that are unspent on the chain. Note that coins part of spend bundles that are pending in the mempool will also be included.
   *
   * @param {Buffer} puzzleHash - Puzzle hash of the wallet.
   * @param {Option<u32>} previousHeight - Previous height that was spent. If null, sync will be done from the genesis block.
   * @param {Buffer} previousHeaderHash - Header hash corresponding to the previous height. If previousHeight is null, this should be the genesis challenge of the current chain.
   * @returns {Promise<UnspentCoinsResponse>} The unspent coins response.
   */
  getAllUnspentCoins(puzzleHash: Buffer, previousHeight: number | undefined | null, previousHeaderHash: Buffer): Promise<UnspentCoinsResponse>
  /**
   * Synchronizes a datastore.
   *
   * @param {DataStoreInfo} storeInfo - Data store information.
   * @param {Option<u32>} lastHeight - Min. height to search records from. If null, sync will be done from the genesis block.
   * @param {Buffer} lastHeaderHash - Header hash corresponding to `lastHeight`. If null, this should be the genesis challenge of the current chain.
   * @returns {Promise<SyncStoreResponse>} The sync store response.
   */
  syncStore(storeInfo: DataStoreInfo, lastHeight: number | undefined | null, lastHeaderHash: Buffer): Promise<SyncStoreResponse>
  /**
   * Synchronizes a store using its launcher ID.
   *
   * @param {Buffer} launcherId - The store's launcher/singleton ID.
   * @param {Option<u32>} lastHeight - Min. height to search records from. If null, sync will be done from the genesis block.
   * @param {Buffer} lastHeaderHash - Header hash corresponding to `lastHeight`. If null, this should be the genesis challenge of the current chain.
   * @returns {Promise<SyncStoreResponse>} The sync store response.
   */
  syncStoreFromLauncherId(launcherId: Buffer, lastHeight: number | undefined | null, lastHeaderHash: Buffer): Promise<SyncStoreResponse>
  /**
   * Broadcasts a spend bundle to the mempool.
   *
   * @param {Vec<CoinSpend>} coinSpends - The coin spends to be included in the bundle.
   * @param {Vec<Buffer>} sigs - The signatures to be aggregated and included in the bundle.
   * @returns {Promise<String>} The broadcast error. If '', the broadcast was successful.
   */
  broadcastSpend(coinSpends: Array<CoinSpend>, sigs: Array<Buffer>): Promise<string>
  /**
   * Checks if a coin is spent on-chain.
   *
   * @param {Buffer} coinId - The coin ID.
   * @param {Option<u32>} lastHeight - Min. height to search records from. If null, sync will be done from the genesis block.
   * @param {Buffer} headerHash - Header hash corresponding to `lastHeight`. If null, this should be the genesis challenge of the current chain.
   * @returns {Promise<bool>} Whether the coin is spent on-chain.
   */
  isCoinSpent(coinId: Buffer, lastHeight: number | undefined | null, headerHash: Buffer): Promise<boolean>
}
