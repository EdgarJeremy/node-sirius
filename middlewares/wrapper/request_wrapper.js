export function a(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch((err) => {
            // console.log(err.type);
            // console.log(err.message);
            console.log(err.name);
            res.status(500);
            res.setStatus(res.GAGAL);
            res.setMessage(err.toString());
            res.go();
        });
    }
}