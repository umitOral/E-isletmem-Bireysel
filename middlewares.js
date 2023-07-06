const accesControl = (req, res, next) => {
    const access = true
    if (!access) {
        res.status(401).json({
            success: false,
            message: "giriş yapınız"
        })
    }
    console.log("acces control middlware")

    next()
}

module.exports = { accesControl }