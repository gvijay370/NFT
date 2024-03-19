import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
//import Debug "mo:base/Debug";

// actor class to create new nfts
actor class  NFT(name: Text, owner : Principal, content : [Nat8]) =this {
        Debug.print("working");

    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

    //query function to return nft name
    public query func getName(): async Text{
        return itemName;
    };

    //query function to return nft owner name
    public query func getOwner(): async Principal{
        return nftOwner;
    };


    //query function to return nft image
    public query func getAsset(): async [Nat8]{
        return imageBytes;
    };

    //query function to return nft canister id
    public query func getCanisterid() : async Principal {
        return Principal.fromActor(this);
    };


    //public shared function to transfer the ownership on buy request.
    public shared(msg) func transferowner(newowner: Principal) : async Text {

        if(msg.caller == nftOwner){
            nftOwner := newowner;
            return "Success";

        }else{
            return "Not initiated by owner";
        }
    }

}; 