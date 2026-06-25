import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttlxvfbmkdwxmsyfwchx.supabase.co';
const supabaseKey = 'sb_publishable_NRct0tSfAF12p_FypnLOXA_n6g5MSs3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateSpam() {
  console.log("🚀 Iniciando ataque de spam (simulando colapso)...");
  
  // Vamos a insertar 31 mensajes rápidamente para forzar el colapso
  for (let i = 1; i <= 31; i++) {
    await supabase.from('mensajes').insert({ texto: `Spam automático ${i}` });
    console.log(`💥 Mensaje ${i} enviado...`);
    // Pequeña pausa para que se vea el progreso en la barra
    await new Promise(r => setTimeout(r, 100)); 
  }
  
  console.log("✅ Servidor colapsado con éxito. Revisa la pantalla.");
}

simulateSpam();
