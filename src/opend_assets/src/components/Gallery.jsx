import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {

  const [fetchdata, setfetach] = useState();

  function fetchNFT() {
    if (props.ids != undefined){
      setfetach(
        props.ids.map((NFTid)=>
          <Item id={NFTid} key={NFTid.toText()} role = {props.role}/>)
      );
    }
  }

  useEffect(() => {
    fetchNFT();
  }, [])

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {fetchdata}
          </div>
          {/* <Item id="rrkah-fqaaa-aaaaa-aaaaq-cai"/> */}
          
        </div>
      </div>
    </div>
  );
}

export default Gallery;
