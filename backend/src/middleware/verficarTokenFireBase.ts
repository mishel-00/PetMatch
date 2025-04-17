

//? ✅ Verificar token de Firebase Auth -> Valido entra, inválido 401 no autorizado
//* La barrera del mercadona 

import { Request, Response, NextFunction } from "express";
import admin from "../firebase";


export const verificarTokenFireBase = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token no proporcionado o mal formado" });
      return; 
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      req.uid = uid;
      next();
    } catch (error) {
      console.error("Error al verificar token:", error);
      res.status(401).json({ error: "Token inválido" });
      return; 
    }
}