import { PriceType, SocketMsgPropType, symbolMap, SymbolType } from "../types";

type getCurrentAssetPriceProps = {
  selectedSymbol: SymbolType;
  setCurrentAssetPrice: React.Dispatch<React.SetStateAction<PriceType | null>>;
  latestWsArray: SocketMsgPropType[] | [];
};
export const getCurrentAssetPrice = ({
  selectedSymbol,
  setCurrentAssetPrice,
  latestWsArray,
}: getCurrentAssetPriceProps) => {
  //get the selected symbol
  //get latestdataArr
  //get setorderPrize
  const fullSymbol = symbolMap[selectedSymbol];
  const filteredArray = latestWsArray.filter(
    (socketData) => socketData.symbol === fullSymbol
  );
  if (!filteredArray) {
    console.log("selected symbol dont have a match in filtered array");
  }
  if (filteredArray[0]?.symbol === fullSymbol) {
    setCurrentAssetPrice(filteredArray[0].price);
  }
};
