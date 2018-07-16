export function onlyAuth() {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            res.setStatus(res.GAGAL);
            res.setMessage("Anda belum login");
            res.go();
        } else {
            next();
        }
    }
}

export function onlyAdmin() {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            res.setStatus(res.GAGAL);
            res.setMessage("Anda belum login");
            res.go();
        } else {
            if(req.user.level !== "Administrator") {
                res.status(401);
                res.setStatus(res.GAGAL);
                res.setMessage("Level ditolak");
                res.go();
            } else {
                next();
            }
        }
    }
}