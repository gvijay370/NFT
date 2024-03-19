import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTactorclass  "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";


actor OpenD {

    private type Listing = {
        itemOwner: Principal;
        itemprice : Nat;
    };

    //Hashmap to store nfts with respect to their principal ids
    var mapOfNFTs = HashMap.HashMap<Principal, NFTactorclass.NFT>(1, Principal.equal, Principal.hash);
    //Hashmap to store list of nfts owned by each onwner with respect to owners principal ids
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    //Hashmap to store list of nfts that are listed after sell
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);


    //public function to create mint new nft from minter.jsx
    public shared(msg) func mint(imagedata : [Nat8], name : Text): async Principal{

        let owner : Principal = msg.caller;

        Debug.print("owner");
        Debug.print(debug_show(owner));

        Debug.print(debug_show(Cycles.balance()));
        Cycles.add(100_500_000_000);

        let newNFT = await NFTactorclass.NFT(name, owner, imagedata);

        Debug.print(debug_show(Cycles.balance()));

        let newNFTprincipal = await newNFT.getCanisterid();

        mapOfNFTs.put(newNFTprincipal, newNFT);
        addToOwnershipMap(owner, newNFTprincipal);

        return newNFTprincipal;


    };


    //private function to add minted nft to owners list of nfts hashmap.
    private func addToOwnershipMap(owner: Principal, nftID : Principal) {
        var ownedNFTs : List.List<Principal> =switch(mapOfOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        ownedNFTs := List.push(nftID, ownedNFTs);
        mapOfOwners.put(owner, ownedNFTs);
    };


    //public query function return list of nfts owned ny particular owner.
    public query func getNFTs(user: Principal): async [Principal]{

        var listofNFTS : List.List<Principal> = switch(mapOfOwners.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };

        Debug.print(debug_show(List.toArray(listofNFTS)));

        return List.toArray(listofNFTS);


    };


    //public function to add nfts to nfts listed hashmap after sell initiated by owner.
    public shared (msg) func listItem(id: Principal, price: Nat) : async Text{

        Debug.print("ID number");
        Debug.print(debug_show(id));
        var item : NFTactorclass.NFT =  switch(mapOfNFTs.get(id)) {
            case null return "NFT does not exist.";
            case (?result) result;
        };

        let owner = await item.getOwner();

        if(Principal.equal(owner, msg.caller)){

            let newListing : Listing = {
                itemOwner = owner;
                itemprice  = price;
            };

            mapOfListings.put(id, newListing );
            return "Success";

        }else{
            return "You don't own this NFT"
        }
};

    //public query function to return listes nfts principal ids
    public query func getListed(): async [Principal] {

        let ids : [Principal] = Iter.toArray(mapOfListings.keys());

        return ids;
    };

    //query function to return 
    public query func getopedID(): async Principal{
        return Principal.fromActor(OpenD);

    };

     

    //query function to check the nft is listed on not while rendering in collection page.
    public query func isListed(id : Principal): async Bool {
 
        if (mapOfListings.get(id) == null){
            return false;
        }else{

        return true;
        }
 

    };


    //query function return owner principal id of a listed nft to sell
    public query func getOriginalowner(id : Principal) : async Principal{
        var listing : Listing = switch(mapOfListings.get(id)){
            case null return Principal.fromText("");
            case (?result) result;
        };

        return listing.itemOwner;
    };

    //query function return owner price of a listed nft to sell
    public query func getOriginalprice(id : Principal) : async Nat{
        var listing : Listing = switch(mapOfListings.get(id)){
            case null return 0;
            case (?result) result;
        };

        return listing.itemprice;
    };


    //public function to complete the buy option by tarnsferring the ownership and removing the nft from previous owners list of nfts hashmap.
    public shared(msg) func completepurchase(id: Principal, ownerid :Principal, newownerid : Principal): async Text{
            var purchasedNFT : NFTactorclass.NFT = switch(mapOfNFTs.get(id)) {
                case null return "NFT does not exist";
                case (?result) result;
            };

            let transferresult = await purchasedNFT.transferowner(newownerid);
            if (transferresult == "Success"){
                mapOfListings.delete(id);
                var ownednfts : List.List<Principal> = switch(mapOfOwners.get(ownerid)){
                    case null List.nil<Principal>();
                    case (?result) result;
                };

                ownednfts := List.filter(ownednfts, func(listednft: Principal): Bool {
                    return listednft != id;
                });

                addToOwnershipMap(newownerid, id);
                return "Success";

            }else{
                return " Transfer Failed";
            }


            

    }
 
};
