const verifyRequest = (req, res, next) => {


    const supabaseAuth = true

    if (supabaseAuth) {
        next();
        return res.status(200).json({ success: "Valid Request" });
    }
    else{
        return res.status(401).json({ error: "Invalid Request" });
    }
}
export default verifyRequest;