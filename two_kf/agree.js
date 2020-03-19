// 位置：对话按钮

// -----------------分隔符------------------

// 关键字：agree
// 参数：category, inquiry_ident
// 描述：接受
// 值：见下方

// -----------------分隔符------------------

// status == 0 拒绝
// status == 1 同意

// 给询问者发送信息
SystemCMD.send("{\"inquiry_feedback\":{\"category\":\""+category+"\", \"status\":\"1\"}}", inquiry_ident);