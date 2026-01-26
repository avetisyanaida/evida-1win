import useMedia from "./useMedia";
import {media} from "./utils";

const useBreakpoints = () => {
    const isMobile = useMedia(media.mobile, false);  // 576px
    const bigMobile: boolean = useMedia(media.bigMobile, false); // 700px
    const isTablet = useMedia(media.tablet, false);  // 767px
    const isDesktop = useMedia(media.desktop, false);  // 1200px
    const isDesktopSmall = useMedia(media.desktopSmall, false);  // 1120px
    const isTabletMiddle = useMedia(media.tabletMiddle, false);  // 991px
    const isTabletLarge = useMedia(media.tabletLarge, false); //930px
    const isDesktopMiddle = useMedia(media.desktopMiddle, false);  // 1500px
    const isDesktopLarge = useMedia(media.desktopLarge, false);  // 1400px


    return {isMobile, bigMobile, isTablet, isDesktop, isTabletMiddle, isDesktopLarge, isDesktopMiddle,isDesktopSmall, isTabletLarge};
};
export default useBreakpoints;