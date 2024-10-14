
/**
 * 窗体类型
 * 0:Loading类型窗体，加载页面
 * 1：Screen 全屏幕的  两种一种可顶掉，不可顶掉。
 * 2：Fixed 类型。比如。大厅中玩家的排行版 这种打开后附着在某个位置固定。打开有打开效果
 * 3：win 类型  点击其他区域是否关闭
 * 4: 
 */
export enum FormType {
    //loading窗体
    FormType_Loading,
    //屏幕窗体
    FormType_Screen,
    //固定窗体 比如：头部的玩家信息  大厅内的排行榜
    FormType_Fixed,
    //基于screen的弹框
    FormType_Popup,
    //浮动窗体
    FormType_Float,
    //能够拦截float的弹框
    FormType_Win,
    //气泡
    FormType_Bubble,
}


/**
 * 气泡出现的种类
 * 1、屏幕中间
 * 2、屏幕中间 上面 
 * 3、屏幕的 右边 上面
 * 4、屏幕的 右边 下面
 */
export enum BubbleAppearType {
    //中心位置
    AppearType_CenterCenter,
    //中间上面
    AppearType_CenterTop,
    //右上
    AppearType_RightTop,
    //右下
    AppearType_RightBottom
}

/**
 * 气泡的类型
 * 1、渐隐消失
 * 2、渐隐向上移动消失
 */
export enum BubbleDisAppearType {
    //渐隐消失
    DisappearType_FadeOut,
    //渐隐向上移动 消失
    DisappearType_MoveUp_FadeOut,
    //渐隐向下移动 消失
    DisappearType_MoveDown_FadeOut
}

/**
 * 透明度类型
 */
export enum ModalOpacity {

    None,           //没有遮罩，可以穿透
    OpacityZero,    //完全透明，不能穿透   0
    OpacityLow,     //高透明度，不能穿透   80
    OpacityHalf,    //半透明，不能穿透     125
    OpacityHigh,    //低透明度，不能穿透   200
    OpacityFull,    //完全不透明           255
}

/**
 * UI 状态
 */
export enum UIState {
    None = 0,
    Loading = 1,
    Showing = 2,
    Hiding = 3
}

export class SysDefine {
    //路径常量
    public static SYS_PATH_CANVAS = "Canvas";
    public static SYS_PATH_UIFORMS_CONFIG_INFO = "UIFormsConfigInfo";
    public static SYS_PATH_CONFIG_INFO = "SysConfigInfo";

    //标签常量
    public static SYS_UIROOT_NAME = "Canvas/Root/UIROOT";
    public static SYS_UIMODAL_NAME = "Canvas/Root/UIROOT/UIModalManager";
    public static SYS_UIAdapter_NAME = "Canvas/Root/UIROOT/UIAdapterManager";

    //节点常量
    public static SYS_SCENE_NODE = "Root";
    public static SYS_UIROOT_NODE = "UIROOT";
    //全屏幕窗口节点
    public static SYS_SCREEN_NODE = "UIScreen";
    //附着在Scene上的节点
    public static SYS_FIXED_NODE = "UIFixed";

    public static SYS_POPUP_NODE = "UIPopup";

    public static SYS_FLOAT_NODE = "UIFloat";

    public static SYS_WIN_NODE = "UIWin";

    public static SYS_LOADING_NODE = "UILoading";


    //气泡节点 
    public static SYS_BUBBLE_NODE = "UIBubble";


    //全局屏蔽层
    public static SYS_BLOCK_NODE = "UIBlock";


    //符号规范
    public static SYS_STANDARD_Prefix = "_";
    public static SYS_STANDARD_Separator = "$";
    public static SYS_STANDARD_End = "#";
    //todo dev
    public static UI_PATH_ROOT = "UIForms/";

}

