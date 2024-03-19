export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completepurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'getListed' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getNFTs' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Principal)], ['query']),
    'getOriginalowner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getOriginalprice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getopedID' : IDL.Func([], [IDL.Principal], ['query']),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
