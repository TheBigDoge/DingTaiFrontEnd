const http = require('http');
const hostname = '101.200.91.29';
const port = 30077;
const server = http.createServer((req, res) => {
    // 设置状态码为200
    res.statusCode = 200;
    // 设置内容类型为纯文本
    res.setHeader('Content-Type', 'text/plain');
    // 添加Cache-Control头部，禁止缓存
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    // 添加Pragma头部，禁止缓存（为了兼容旧版浏览器）
    res.setHeader('Pragma', 'no-cache');
    // 设置Expires头部为一个过去的日期，使内容立即过期。或者使用具体的过期日期，如 'Expires: Tue, 03 Jul 2001 06:00:00 GMT'
    res.setHeader('Expires', '0'); 
    // 发送响应体
    res.end('Hello World\n');
});
// 监听指定的端口和主机名
server.listen(port, hostname, () => {
    console.log(`Server running at http://101.200.91.29:30077/`);
});