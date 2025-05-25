const handleBarCodeScanned = async ({ data }: { data: string }) => {
  setScanned(true);
  
  // 🔍 DEBUG: Mostrar el contenido completo del QR
  Alert.alert("📦 QR escaneado - Contenido RAW", `"${data}"`);
  
  // 🔍 DEBUG: Mostrar la longitud del string
  Alert.alert("📏 Longitud del string", `${data.length} caracteres`);
  
  // 🔍 DEBUG: Verificar si empieza con el formato esperado
  const startsWith = data.startsWith("petmatch://cita?id=");
  Alert.alert("🔍 ¿Empieza con petmatch://cita?id=?", startsWith ? "✅ SÍ" : "❌ NO");
  
  // 🔍 DEBUG: Mostrar los primeros 30 caracteres
  Alert.alert("🔤 Primeros 30 caracteres", data.substring(0, 30));

  try {
    let citaId: string | null = null;

    // 🔍 Extraer citaId solo del formato esperado: petmatch://cita?id=XXX
    if (data.startsWith("petmatch://cita?id=")) {
      citaId = data.substring("petmatch://cita?id=".length);
      Alert.alert("✅ ID extraído exitosamente", `ID: "${citaId}"`);
    } else {
      // 🔍 DEBUG: Intentar encontrar qué formato tiene
      Alert.alert("❌ Formato no esperado", "Analizando formato alternativo...");
      
      if (data.includes("http://")) {
        Alert.alert("🌐 Es una URL HTTP", "Detectado formato HTTP");
      }
      if (data.includes("fichaAnimal")) {
        Alert.alert("📄 Contiene 'fichaAnimal'", "Formato antiguo detectado");
      }
      if (data.includes("?id=")) {
        const idIndex = data.indexOf("?id=") + 4;
        const possibleId = data.substring(idIndex);
        Alert.alert("🔍 Posible ID encontrado", `"${possibleId}"`);
      }
    }

    if (!citaId) {
      Alert.alert("❌ QR inválido", "El código QR no tiene el formato esperado petmatch://cita?id=XXX");
      return;
    }

    // 🔍 DEBUG: Verificar autenticación
    const currentUser = auth.currentUser;
    Alert.alert("👤 Usuario actual", currentUser ? `UID: ${currentUser.uid}` : "❌ No autenticado");
    
    if (!currentUser) {
      Alert.alert("❌ Error", "Usuario no autenticado.");
      return;
    }

    // 🔍 DEBUG: Obtener token
    Alert.alert("🔑 Obteniendo token...", "Por favor espera");
    const token = await currentUser.getIdToken();
    Alert.alert("✅ Token obtenido", `Longitud: ${token.length} caracteres`);
    
    // 🔍 DEBUG: Preparar petición
    const apiUrl = `${API_URL}/api/qr/citaid`;
    Alert.alert("📡 URL de la API", apiUrl);
    Alert.alert("📤 Parámetros de la petición", `id: "${citaId}"`);
    
    // Hacer la petición al backend
    Alert.alert("⏳ Enviando petición...", "Conectando con el servidor");
    
    const response = await axios.get(apiUrl, {
      params: { id: citaId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔍 DEBUG: Respuesta recibida
    Alert.alert("✅ Respuesta del servidor", `Status: ${response.status}`);
    Alert.alert("📦 Tipo de respuesta", `${typeof response.data}`);
    
    const result = response.data;
    
    // 🔍 DEBUG: Contenido de la respuesta
    Alert.alert("📋 Contenido de result", JSON.stringify(Object.keys(result)));

    if (!result.animal) {
      Alert.alert("⚠️ Animal no encontrado", "La cita existe pero no está vinculada a un animal.");
      Alert.alert("🔍 Datos de la cita", JSON.stringify(result));
      return;
    }

    // 🔍 DEBUG: Datos del animal
    Alert.alert("✅ Animal encontrado", `Nombre: ${result.animal.nombre || "Sin nombre"}`);
    Alert.alert("🐾 Datos del animal", `Especie: ${result.animal.especie || "?"}, ID: ${result.animal.id || "?"}`);

    // Navegar con los datos
    Alert.alert("🚀 Navegando a AnimalEscaneado", "Con los datos del animal");
    
    navigation.navigate("AnimalEscaneado", {
      animal: result.animal,
      id: citaId,
    });

  } catch (e: any) {
    Alert.alert("❌ ERROR CAPTURADO", e.toString());
    
    let errorMessage = "Error desconocido";

    if (e.message) {
      errorMessage = e.message;
      Alert.alert("💬 Mensaje de error", errorMessage);
    }

    if (e.response) {
      Alert.alert("🌐 Error de respuesta HTTP", `Status: ${e.response.status}`);
      
      if (e.response.data) {
        Alert.alert("📦 Datos del error", JSON.stringify(e.response.data));
        errorMessage += `\n🧾 Backend: ${JSON.stringify(e.response.data)}`;
      }
    }

    if (e.request) {
      Alert.alert("📡 Error de red", "La petición se envió pero no hubo respuesta");
    }

    Alert.alert(
      "❌ Error al procesar el QR",
      `Error final: ${errorMessage}`
    );
  }
};