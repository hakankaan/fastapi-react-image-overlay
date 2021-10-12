export const mainReducer = (mainData, action) => {
    switch (action.type) {
        case 'setNewImage':
            return {
                ...mainData,
                newImage: action.payload.value
            };

        case 'setRawImageId':
            return {
                ...mainData,
                rawImageId: action.payload.id
            };

        case 'setMaskImageId':
            return {
                ...mainData,
                maskImageId: action.payload.id
            };

        case 'setPathname':
            return {
                ...mainData,
                pathname: action.payload.pathname
            };

        case 'setRawFileList':
            return {
                ...mainData,
                rawFileList: action.payload.list
            };

        case 'setMaskFileList':
            return {
                ...mainData,
                maskFileList: action.payload.list
            };

        case 'getImageSet':
            return {
                ...mainData,
                imageSets: action.payload.imageSet
            };

        case 'setOverlayModal':
            return {
                ...mainData,
                overlayModal: action.payload.value
            };

        case 'setSelectedImageSet':
            return {
                ...mainData,
                selectedImageSet: action.payload.value
            };
            
        case 'setUser':
            return {
                ...mainData,
                user: action.payload.value
            };

        default:
            return mainData;
    }
   
}