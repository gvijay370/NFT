import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor, HttpAgent} from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenidlFactory } from "../../../declarations/token";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./Pricelabel";

function Item(props) {

  const id = props.id;

  //console.log(id);

  const [name, setname] = useState();
  const [owner, setowner] = useState();
  const [image, setimage] = useState();
  const [button, setbutton] = useState();
  const [pricinput, setprice] = useState();
  const [loadhidden, sethidden] = useState(true);
  const [blur, setblur] = useState();
  const [Liststatus, setListstatus] = useState("");
  const [sellprice, setsellprice] = useState();
  const [shoulddisplay, setdisplay] = useState("true");

  const localhost = "http://localhost:8084/";
  const agent = new HttpAgent({host:localhost});
  //When deploying in ICP remove the below line
  agent.fetchRootKey();
  let NFTactor;

  async function loadNFT(){
      NFTactor = await Actor.createActor(idlFactory,{
      agent,
      canisterId : id,
    });

    const nftname = await NFTactor.getName();
    const nftowner = await NFTactor.getOwner();
    const imagedata = await NFTactor.getAsset();
    const imagecontent = new Uint8Array(imagedata);
    const image = URL.createObjectURL( new Blob([imagecontent.buffer], {type : "image/png"}));
    setname(nftname);
    setowner(nftowner.toText());
    setimage(image);

    const isnftlisted = await opend.isListed(props.id);

    if(props.role == "Collection"){

    if (isnftlisted){
      setowner("OpenD");
      setblur({filter : "blur(4px)"});
      setListstatus("Listed");
  
    }else{
    setbutton(<Button handleclick={handlesell} text={"Sell"}/>);}
    }else if (props.role == "Discover"){
      const own = await opend.getOriginalowner(id);
      if (own.toText() != CURRENT_USER_ID.toText()){
        setbutton(<Button handleclick={handlebuy} text={"Buy"}/>);}
      else{
        setbutton(<Button handleclick={handlebuy} text={"You are the owner"}/>);
      }
      const nftprice = await opend.getOriginalprice(props.id);
      setsellprice(<PriceLabel price={nftprice.toString()} />);
    }
  };


  async function handlebuy(){
    sethidden(false);
    console.log("Buy");
    const tokenactor = await Actor.createActor(tokenidlFactory,{
      agent,
      canisterId : Principal.fromText("qsgjb-riaaa-aaaaa-aaaga-cai"),
    });

    const sellerid = await opend.getOriginalowner(props.id);
    const itemprice = await opend.getOriginalprice(props.id);

    const result = await tokenactor.transfer(sellerid, itemprice);
    console.log(result);
    if (result == "Success"){
      const tranresult = await opend.completepurchase(props.id, sellerid, CURRENT_USER_ID);
      console.log("Purchase:" + tranresult);
      sethidden(true);
      setdisplay(false);
    }

  }

  let price;

  function handlesell(){
    console.log('button clicked');
    setprice(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />);

    setbutton(<Button handleclick={sellitem} text={"Confirm"} />);
  };

  async function sellitem(){
    setblur({ filter : "blur(4px)"});
    sethidden(false);
    console.log(price);
    const listingResult = await opend.listItem(id, Number(price));
    console.log(listingResult);
    if (listingResult == "Success"){
      const openid = await opend.getopedID();
      const transferresult = await NFTactor.transferowner(openid);
      console.log(transferresult);
      if (transferresult == "Success"){
        sethidden(true);
        setbutton();
        setprice();
        setowner("OpenD");
        setListstatus("Listed");
      }
    
    
    }

    
  };

 

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div style={{display : shoulddisplay?"inline" : "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loadhidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {sellprice}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {Liststatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {pricinput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
