import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'completepurchase' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'getListed' : () => Promise<Array<Principal>>,
  'getNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getOriginalowner' : (arg_0: Principal) => Promise<Principal>,
  'getOriginalprice' : (arg_0: Principal) => Promise<bigint>,
  'getopedID' : () => Promise<Principal>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
