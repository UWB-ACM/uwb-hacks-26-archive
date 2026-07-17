import { StaticImageData } from "next/image";
import DefaultImage from "@/public/bg.jpg";
import OwalaBlack from "@/public/hackeroonShop/owalas-black.png";
import OwalaWhite from "@/public/hackeroonShop/owalas-white.png";
import LegoCherryBlossoms from "@/public/hackeroonShop/lego-cherry-blossoms.png";
import LegoDaisies from "@/public/hackeroonShop/lego-daisies.jpg";
import LegoF1Cars from "@/public/hackeroonShop/lego-f1-cars.jpg";
import LegoLotus from "@/public/hackeroonShop/lego-lotus.jpg";
import LegoRoses from "@/public/hackeroonShop/lego-roses.jpg";
import LegoSunflowers from "@/public/hackeroonShop/lego-sunflowers.jpg";
import AnkerPortable from "@/public/hackeroonShop/anker-portable.jpg";
import AvanadeBlockTower from "@/public/hackeroonShop/avanade-block-tower.png";
import AvanadeBluetoothTracker from "@/public/hackeroonShop/avanade-bluetooth-tracker.jpg";
import AvanadeFannyPack from "@/public/hackeroonShop/avanade-fanny-pack.png";
import AvanadeMugWarmer from "@/public/hackeroonShop/avanade-mug-warmer.png";
import AvanadePicnicBlanket from "@/public/hackeroonShop/avanade-picnic-blanket.png";
import AvanadeRucksack from "@/public/hackeroonShop/avanade-rucksack.png";
import CarKeychains from "@/public/hackeroonShop/car-keychains.jpg";
import CatKeychains from "@/public/hackeroonShop/cat-keychains.jpg";

export const retrievePrizeImage = (
    prizeName: string | null,
): StaticImageData => {
    switch (prizeName) {
        case "owalaBlack":
            return OwalaBlack;
        case "owalaWhite":
            return OwalaWhite;
        case "legoCherryBlossoms":
            return LegoCherryBlossoms;
        case "legoDaisies":
            return LegoDaisies;
        case "legoF1Cars":
            return LegoF1Cars;
        case "legoLotus":
            return LegoLotus;
        case "legoRoses":
            return LegoRoses;
        case "legoSunflowers":
            return LegoSunflowers;
        case "ankerPortable":
            return AnkerPortable;
        case "avanadeBlockTower":
            return AvanadeBlockTower;
        case "avanadeBluetoothTracker":
            return AvanadeBluetoothTracker;
        case "avanadeFannyPack":
            return AvanadeFannyPack;
        case "avanadeMugWarmer":
            return AvanadeMugWarmer;
        case "avanadePicnicBlanket":
            return AvanadePicnicBlanket;
        case "avanadeRucksack":
            return AvanadeRucksack;
        case "carKeychains":
            return CarKeychains;
        case "catKeychains":
            return CatKeychains;
        default:
            return DefaultImage;
    }
};
