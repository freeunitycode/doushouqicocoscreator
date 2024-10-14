/**
 * 该文件中的目录主要用法
 *
 * node generator_bundle_reslist.js -p projectPath -b bundleName 生成bundle对应的reslist.ts文件
 * node generator_bundle_reslist.js -p projectPath -a            生成所有的bundlelist.ts文件
 * 
 * 这要求每一个reslist.ts文件所在的目录都是bundle的根目录
 * 
 * 说明：说有方法的执行全部使用同步api，不要使用异步api，放置数据还没有写入，有错误发生
 * 
 */


var fs = require('fs');
var path = require('path');

var bundleList = [
    "Lobby",
    'Battle'               //大厅
];



/** 文件的类型
 export enum ResType{
    ResType_SpriteFrame = 1,                //图片资源 输出类型为 spriteFrame
    ResType_SpriteAtlas = 2,                //图集资源 输出类型为 SpriteAtlas 通过->getSpriteFrame() 能够获取对应的SpriteFrame 要求图集 plist和png的名字除了后缀是一样的
    ResType_AudioClip = 3,                  //音频资源 输出类型为 AudioClip   
    ResType_Prefab = 4,                     //预制体   输出类型为 Prefab
    ResType_Spine = 5,                      //骨骼动画资源 输出类型为 sp.SkeletionnData 要求三种资源类型必须一致
    ResType_Fnt = 6,                        //字体资源类型 输出格式为 LabelAtlas 要求 字体 fnt文件和png文件的名字除了后缀必须一致
    ResType_Animation = 7,                  //动画资源   输出格式为AnimationClip

    //一下几种是需要扩展的，以后会用到的。但是本次不准备实现
    ResType_Material  = 8,                  //材质
    ResType_Shader = 9,                     //shader 高级效果展示，资源缓存的时候暂时不处理
}
 */


var projectPath = "../assets/";

var bundleName = "";

var isAll = false;
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];
    switch (arg) {
        case '-p':
            projectPath = process.argv[i + 1];
            i += 2;
            break;
        case '-b':
            bundleName = process.argv[i + 1];
            i += 2;
            break;
        case '-a':
            isAll = true;
            i += 2;
            break;
    }
}

if (!isAll && bundleName == "") {
    console.log(`请输入正确的参数 检查 -a | -b bundle`);
    return;
}

//检查资源，主要为了判定 某一些资源类型 如：图集中的png和一般png的区别
var cacaheMap = {};
//最终生成的map 数据结构 ["bunleName/img/aa.png"] = 1;类似这样的数据结构
var data_first_generator = new Map();


const ResType = {
    "ResType_UnKnow": 0,                   //未知的资源类型
    "ResType_SpriteFrame": 1,               //图片资源
    "ResType_SpriteAtlas": 2,               //图集资源
    "ResType_AudioClip": 3,                 //音频资源
    "ResType_Prefab": 4,                     //预制体
    "ResType_Spine": 5,                      //骨骼动画资源
    "ResType_Fnt": 6,                        //字体资源
    "ResType_Animation": 7,                  //动画资源
    "ResType_Material": 8,                   //材质资源
    "ResType_Shader": 9,                     //shader资源
    "ResType_Particle": 10,                  //粒子特效资源
}
//遍历目录
function readDir(rootPath) {
    let mapData = new Map();
    let paths = fs.readdirSync(rootPath);
    for (let i = 0; i < paths.length; i++) {
        let fileName = paths[i];
        fileName = rootPath + "/" + fileName;
        let statInfo = fs.statSync(fileName);
        if (statInfo.isFile()) {
            let strExt = path.extname(paths[i]);
            // if(strExt == ".prefab"){
            //     //预制体prefab
            //     list.push(fileName);
            //     mapData[fileName] = 
            // }else if (strExt == ".mp3"){
            //     //音频资源直接加进去
            //     list.push(fileName);
            // }

            if (strExt != ".ts" && strExt != ".js" && strExt != ".meta" && strExt != ".json" && strExt != ".bin") {
                //这里不处理.ts 脚本文件
                //.js 脚本文件
                //.meta uuid 纪录文件
                //.json文件  
                //.bin 文件。这种二进制文件的加载都去动态加载
                mapData.set(fileName, 1);
            }

        } else if (statInfo.isDirectory()) {
            let subMap = readDir(fileName);
            // for (let idx = 0;idx < subList.length;idx ++){
            //   list.push(subList[idx]);
            // }
            for (let key of subMap.keys()) {
                mapData.set(key, subMap.get(key));
            }
        }
    }
    return mapData;
}


//判定是否是图集资源 或者 设置 plist对应的 png为 图集资源不要再作为 spriteFrame使用了


//从atlas文件或者txt文件中提取对应的png文件名字

//但从技术上说，这样的读取文件没有考虑大文件的问题，但是我们的配置文件使用这种方法应该是可以的。
function getPngFilenameFromAtlasOrTxt(fileName) {
    let list = [];
    fs.readFileSync(fileName, 'utf-8').split(/\r?\n/).forEach(function (line) {
        let lastIdx = line.lastIndexOf(".png");
        if (lastIdx != -1) {
            list.push(line);
        }
    });
    return list;
}



//判定plist文件是Atlas还是Particle
//返回true 标识是粒子特效
function chkIsAtlasOrParticle(filePath) {
    let isParticle = false;
    let reg = /<key>radialAcceleration<\/key>/;
    fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).forEach(function (line) {
        var result = reg.exec(line);
        if (result && result[0]) {
            isParticle = true;
        }
    });
    return isParticle;
}


//从plist文件中提取png文件的名字
function getPngFilenameFormPlist(filePath) {
    let reg = /<string>[a-zA-Z0-9-_]+.png<\/string>/;
    let name = "";
    fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).forEach(function (line) {
        var result = reg.exec(line);
        if (result && result[0]) {
            name = result[0];
        }
    })
    let res = name.substring(8, name.length - 9);
    return res;
}



/**
 * 从fnt文件中提取png文件
 * @param {*} fileName 
 */
function getPngFileNameFromFnt(fileName) {
    let list = [];
    fs.readFileSync(fileName, 'utf-8').split(/\r?\n/).forEach(function (line) {
        var regStr = /\"[a-zA-Z0-9-_]+.png\"/;
        var reg = new RegExp(regStr);
        var result = reg.exec(line);
        if (result && result[0]) {
            let pngNameStr = result[0].substring(1, result[0].length - 1);
            list.push(pngNameStr);
        }
    });
    return list;
}


var generator_bundle_data = new Map();

//处理map中提取到的资源
function dealMapData() {
    for (let key of data_first_generator.keys()) {
        let state = data_first_generator.get(key);
        if (state == 1) {
            //说明该文件没有被判定过
            let fileName = key;
            let strExt = path.extname(fileName);
            if (strExt == ".prefab") {
                //预制体资源
                generator_bundle_data.set(fileName, ResType.ResType_Prefab);
                data_first_generator.set(fileName, 0);
            } else if (strExt == ".mp3") {
                //音频资源
                generator_bundle_data.set(fileName, ResType.ResType_AudioClip);
                data_first_generator.set(fileName, 0);
            } else if (strExt == ".fnt") {
                generator_bundle_data.set(fileName, ResType.ResType_Fnt);
                //字体对应的png文件
                let extdotIdx = fileName.lastIndexOf(".");
                let fileNameWithoutExt = fileName.substring(0, extdotIdx);
                // let filePngFileName = fileNameWithoutExt + ".png";
                let filePngFileNameArr = getPngFileNameFromFnt(fileName);

                let idx = fileName.lastIndexOf("/");
                let filePath = fileName.substring(0, idx);
                if (filePngFileNameArr.length > 0) {
                    for (let i = 0; i < filePngFileNameArr.length; i++) {
                        let fielPngName = filePath + "/" + filePngFileNameArr[i];
                        if (data_first_generator.has(fielPngName)) {
                            data_first_generator.set(fielPngName, 0);
                        } else {
                            console.log(`${fielPngName}.fnt 字体文件提取出来的png文件没有被找到`);
                        }
                    }
                } else {
                    console.log(`${fileNameWithoutExt}.fnt 字体文件没有找到对应的png`);
                }
            } else if (strExt == ".anim") {
                //cocos creator中的动画
                generator_bundle_data.set(fileName, ResType.ResType_Animation);
                data_first_generator.set(fileName, 0);
            } else if (strExt == ".plist") {

                //优先判定是粒子特效还是合图资源
                if (chkIsAtlasOrParticle(fileName)) {
                    //粒子特效
                    generator_bundle_data.set(fileName, ResType.ResType_Particle);
                    let pngFileWithExt = getPngFilenameFormPlist(fileName);
                    let pIdx = fileName.lastIndexOf("/");
                    let pp = fileName.substring(0, pIdx);
                    pp = pp + "/" + pngFileWithExt;
                    if (data_first_generator.has(pp)) {
                        data_first_generator.set(pp, 0);
                    } else {
                        console.log(`${fileName} 粒子特效没有或者没有找到对应的png`)
                    }
                } else {
                    //合图资源 
                    generator_bundle_data.set(fileName, ResType.ResType_SpriteAtlas);
                    //合图对应的png资源
                    let extdotIdx = fileName.lastIndexOf(".");
                    let fileNameWithoutExt = fileName.substring(0, extdotIdx);
                    let filePngFileName = fileNameWithoutExt + ".png";
                    if (data_first_generator.has(filePngFileName)) {
                        data_first_generator.set(filePngFileName, 0);
                        //设置对应的plist png 失效 已经遍历过了
                        data_first_generator.set(fileName, 0);
                    } else {
                        console.log(`${fileNameWithoutExt}.plist 图集没有找到对应的png`);
                    }
                }
            } else if (strExt == ".atlas" || strExt == ".txt") {
                //spine动画  提取png文件的名字
                let pngArr = getPngFilenameFromAtlasOrTxt(fileName);
                if (pngArr.length > 0) {
                    for (let k = 0; k < pngArr.length; k++) {
                        let idx = fileName.lastIndexOf("/");
                        //这里不做兼容了
                        let filePath = fileName.substring(0, idx);
                        let pngFileName = filePath + "/" + pngArr[k];
                        if (!data_first_generator.has(pngFileName)) {
                            console.log(`没有找到${fileName}对应的png资源 ${pngFileName}`);
                        } else {
                            data_first_generator.set(pngFileName, 0);
                        }
                    }
                    data_first_generator.set(fileName, 0);
                    generator_bundle_data.set(fileName, ResType.ResType_Spine);
                }


            } else if (strExt == ".mtl") {
                //材质
                generator_bundle_data.set(fileName, ResType.ResType_Material);
                data_first_generator.set(fileName, 0);
            } else {

            }
        }
    }

    //在遍历一次 这个执行 处理 png jpg文件
    for (let key of data_first_generator.keys()) {
        let state = data_first_generator.get(key);
        if (state == 1) {
            let fileName = key;
            console.log(".png资源==========");
            let strExt = path.extname(fileName);
            if (strExt == ".png" | strExt == ".jpg") {
                generator_bundle_data.set(fileName, ResType.ResType_SpriteFrame);
                data_first_generator.set(fileName, 0);
            }
        }
    }
}


function arrayData(targetPath) {
    let data = {};
    let idx = targetPath.lastIndexOf("/");
    for (let key of generator_bundle_data.keys()) {
        let fileName = key;
        let result = fileName.substring(idx + 1);
        let extdotIdx = result.lastIndexOf(".");
        result = result.substring(0, extdotIdx);

        let bundleIdx = result.indexOf(bundleName);
        result = result.substring(bundleIdx)
        data[result] = generator_bundle_data.get(key);
    }
    return data;
}


let writeFile = function (rootPath, data) {
    let str = "/*generator by gen reslit tools do not edit it!*/" + "\n";
    str = str + "export let reslist:Map<string,number> = new Map<string,number>([" + "\n";
    for (let key in data) {
        str = str + `["${key}",${data[key]}],` + "\n";
    }
    str = str + "]);" + "\n";
    if (!fs.existsSync(rootPath + "/reslist.ts")) {
        fs.crea
    }
    fs.writeFile(rootPath + "/reslist.ts", str, "utf-8", err => {
        if (err) {
            console.log("写入reslist失败" + err.message);
        } else {
            console.log(`生成${rootPath}下的reslist成功!`);
        }
    });
}


if (isAll) {
    for (var k = 0; k < bundleList.length; k++) {
        var targetDirectoryPath = path.join(projectPath, bundleList[k]);
        //遍历目录
        data_first_generator = readDir(targetDirectoryPath);
        dealMapData();

        let data = arrayData(targetDirectoryPath);
        writeFile(targetDirectoryPath, data);

        console.log(`${bundleName}写入reslist.ts文件处成功!`);
    }
} else {
    var targetDirectoryPath = path.join(projectPath, bundleName);
    //console.log(targetDirectoryPath);
    //遍历目录
    data_first_generator = readDir(targetDirectoryPath);

    let tempData = new Map();
    for (let aa of data_first_generator.keys()) {
        let kk = aa;
        kk = kk.replace(/\\/g, "/");
        tempData.set(kk, data_first_generator.get(aa));

    }
    data_first_generator = tempData;
    console.log(data_first_generator);
    dealMapData();

    let data = arrayData(targetDirectoryPath);
    //console.log(data);
    if (bundleName == "Lobby") {
        targetDirectoryPath = path.join(projectPath, "ScriptCore")
        console.log("大厅=-=====");
        console.log(targetDirectoryPath);
        console.log("大厅=-=====");
        writeFile(targetDirectoryPath, data);
    } else {
        writeFile(targetDirectoryPath, data);
    }


    console.log(`${bundleName}写入reslist.ts文件处成功!`);

}
