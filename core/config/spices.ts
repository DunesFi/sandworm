export const BASE_AMOUNT = 1n ** 18n; // Base amount for 10000 points
export const BASE_POINTS = 1_000n; // Points corresponding to the base amount
export const REF_SHARE = 10n; // %10


export interface SpiceConfiguration {
    BASE_MINT_AMOUNT: bigint; // Base amount for minting, represented in smallest units
    BASE_MINT_POINTS: bigint; // Points earned for minting the base amount
    HOLD_AMOUNT: bigint; // Amount held daily for earning points
    HOLD_POINTS: bigint; // Points earned for holding the base amount daily
    REF_SHARE: bigint; // Ref share %

}

/**
 * Configuration map linking asset identifiers to their respective configurations.
 */
export interface SpiceConfigurations {
    [asset: string]: SpiceConfiguration;
}

const spiceConfig: SpiceConfigurations = {
    DETH: {
        BASE_MINT_AMOUNT: 10n ** 18n,
        BASE_MINT_POINTS: 1_000n,
        HOLD_AMOUNT: 1n ** 18n,
        HOLD_POINTS: 100n,
        REF_SHARE: 10n //%10
    }
};
export default spiceConfig;