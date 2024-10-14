/**
 * 
 * @param 将prefab的路径分隔为 bundle 和 prefabName 
 * @returns 
 */
export const splitFormName = (formName: string) => {
    let result = { bundle: "", prefabName: "" };
    let arr = formName.split('/');
    if (arr.length <= 0) {
        return result;
    }
    let bundleName = arr[0];
    let prefabName: string = "";
    for (let k = 1; k < arr.length; k++) {
        prefabName = prefabName + arr[k] + "/";
    }

    prefabName = prefabName.substring(0, prefabName.length - 1);
    result.bundle = bundleName;
    result.prefabName = prefabName;
    return result;
}