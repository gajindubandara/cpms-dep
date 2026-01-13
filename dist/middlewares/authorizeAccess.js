export const authorize = (allowedGroups = []) =>(req,res,next) =>{
    const userGroups = req.user["cognito:groups"] || [];

    const isAllowed = allowedGroups.some((group) => userGroups.includes(group))

    if(!isAllowed){
        return res.status(403).json({message:"Forbidden: Permission not given"})
    }

    next();
};