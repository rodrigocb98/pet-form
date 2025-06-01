import React, { useState, useEffect } from "react";
import './App.css';
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Card, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import Swal from "sweetalert2";


export default function PetRegistry() {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    edad: "",
    raza: "",
    color: "",
    nombreDueno: "",
    telefonoDueno: ""
  });
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (!("NDEFWriter" in window)) {
      Swal.fire({
        icon: 'warning',
        title: 'NFC no soportado',
        text: 'Tu navegador o dispositivo no soporta escritura NFC.',
      });
    }
  }, []);

  const handleChange = (e) => {
    console.log(`Cambiando el campo ${e.target.name} a:`, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
        console.log("Imagen cargada:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    for (const [ value] of Object.entries(formData)) {
      if (!value.trim()) {
        Swal.fire({
          icon: 'warning',
          title: '¡Campos incompletos! 🐾',
          text: 'Por favor completa todos los campos antes de guardar el PDF.',
          confirmButtonColor: '#ffb347',
        });
        return;
      }
    }

    console.log("Generando PDF con los siguientes datos:", formData);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Registro de Mascota", 20, 20);
    let y = 40;
    for (const [key, value] of Object.entries(formData)) {
      console.log(`Añadiendo al PDF - ${key}: ${value}`);
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 20, y);
      y += 10;
    }
    if (imagen) {
      doc.addImage(imagen, 'JPEG', 20, y + 10, 50, 50);
      console.log("Imagen añadida al PDF");
    }
    doc.save("registro_mascota.pdf");
    console.log("PDF guardado como registro_mascota.pdf");
  };

  const escribirEnNFC = async () => {
    if ("NDEFWriter" in window) {
      try {
        const writer = new window.NDEFWriter(); // ← corrección aquí
        await writer.write({
          records: [{
            recordType: "text",
            data: JSON.stringify(formData)
          }]
        });
        Swal.fire({
          icon: 'success',
          title: '¡Datos escritos en NFC! 🐾',
          text: 'Acerca tu dispositivo al lector NFC.',
        });
      } catch (error) {
        console.error("Error al escribir NFC:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al escribir NFC',
          text: error.message,
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'NFC no soportado',
        text: 'Tu navegador o dispositivo no soporta NFC.',
      });
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f0]">
     <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="paw" className="paw-left" />
     <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="paw" className="paw-right" />
      <div className="pet-card">
        
        <div className="space-y-4">
          <input className="pet-input" name="nombre" placeholder="Nombre del perro" onChange={handleChange} />
          <input className="pet-input" name="direccion" placeholder="Dirección" onChange={handleChange} />
          <input className="pet-input" name="edad" placeholder="Edad" onChange={handleChange} />
          <input className="pet-input" name="raza" placeholder="Raza" onChange={handleChange} />
          <input className="pet-input" name="color" placeholder="Color" onChange={handleChange} />
          <input className="pet-input" name="nombreDueno" placeholder="Nombre del dueño" onChange={handleChange} />
          <input className="pet-input" name="telefonoDueno" placeholder="Teléfono del dueño" onChange={handleChange} />
          <input className="pet-input" type="file" accept="image/*" onChange={handleImageChange} />
          <button className="pet-button" onClick={generatePDF}>Guardar en PDF</button>
          <button className="pet-button" onClick={escribirEnNFC}>Guardar en NFC</button>
        </div>
      </div>
    </div>
  );
}
