// Importaciones necesarias
import { useState, useEffect } from "react"; // Para manejar estados y efectos
import axios from "axios"; // Si necesitas realizar solicitudes HTTP
import { useRouter } from "next/router"; // Si estás usando Next.js para manejar rutas

import { Bar } from "react-chartjs-2"; // Para gráficos de barras
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Para configurar gráficos de Chart.js
import { Chart } from "chart.js"; // Para la configuración de gráficos 

