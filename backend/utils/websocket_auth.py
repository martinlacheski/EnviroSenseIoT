from fastapi import WebSocket, status
from utils.authentication import auth_user, current_user

async def websocket_current_user(websocket: WebSocket):
    try:
        # Obtener el token del header o query parameter
        token = websocket.headers.get("authorization") or websocket.query_params.get("authorization")
        if not token:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None
            
        # Limpiar el token (eliminar 'Bearer ' si existe)
        if token.startswith("Bearer "):
            token = token[7:]
            
        user = await auth_user(token)
        return await current_user(user)
       
    except Exception as e:
        print(f"Error en la autenticación del WebSocket: {e}")
        await websocket.send_text( f"Error en la autenticación del WebSocket: {str(e)}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None
        
