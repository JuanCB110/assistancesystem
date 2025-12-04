import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AsistenciaService } from '../../../../services/api/asistencia.service';
import { UsuarioService } from '../../../../services/api/usuario.service';
import { HorarioService } from '../../../../services/api/horario.service';
import { Asistencia, Usuario, HorarioMaestro } from '../../../../models';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-consulta-asistencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './consulta-asistencias.component.html',
  styleUrls: ['./consulta-asistencias.component.css']
})
export class ConsultaAsistenciasComponent implements OnInit {
  maestros: Usuario[] = [];
  asistencias: Asistencia[] = [];
  horarios: HorarioMaestro[] = [];
  
  selectedMaestro = '';
  selectedDate = new Date();
  
  loading = false;
  error: string | null = null;

  weekStats = {
    total: 0,
    asistencias: {
      checador: 0,
      jefe: 0,
      maestro: 0
    },
    faltas: {
      checador: 0,
      jefe: 0,
      maestro: 0
    },
    retardos: {
      checador: 0,
      jefe: 0,
      maestro: 0
    }
  };

  diasSemana = [
    { nombre: 'Lunes', index: 1 },
    { nombre: 'Martes', index: 2 },
    { nombre: 'Miércoles', index: 3 },
    { nombre: 'Jueves', index: 4 },
    { nombre: 'Viernes', index: 5 }
  ];

  displayedColumns = ['hora', 'materia', 'grupo', 'checador', 'jefe', 'maestro'];

  constructor(
    private asistenciaService: AsistenciaService,
    private usuarioService: UsuarioService,
    private horarioService: HorarioService
  ) { }

  ngOnInit() {
    this.loadMaestros();
  }

  async loadMaestros() {
    try {
      this.maestros = await this.usuarioService.getMaestros();
    } catch (error) {
      this.error = 'Error al cargar profesores de la base de datos';
    }
  }

  async consultarAsistencias() {
    if (!this.selectedMaestro) {
      this.error = 'Por favor seleccione un profesor';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const startDate = this.getWeekStartDate();
      const endDate = this.getWeekEndDate();
      
      this.asistencias = await this.asistenciaService.getByMaestroAndWeek(
        Number(this.selectedMaestro),
        startDate,
        endDate
      );
      
      this.horarios = await this.horarioService.getByMaestro(Number(this.selectedMaestro));
      
      // Calcular estadísticas de la semana
      this.calculateWeekStats();
    } catch (error) {
      this.error = 'Error al consultar las asistencias';
    } finally {
      this.loading = false;
    }
  }

  calculateWeekStats() {
    // Resetear estadísticas
    this.weekStats = {
      total: 0,
      asistencias: { checador: 0, jefe: 0, maestro: 0 },
      faltas: { checador: 0, jefe: 0, maestro: 0 },
      retardos: { checador: 0, jefe: 0, maestro: 0 }
    };

    // Contar horarios de la semana (Lunes a Viernes)
    const startDate = new Date(this.getWeekStartDate());
    const endDate = new Date(this.getWeekEndDate());
    
    // Filtrar horarios que corresponden a días de lunes a viernes
    const horariosValidos = this.horarios.filter(h => {
      if (!h.dias) return false;
      const diasNormalizados = h.dias.toLowerCase().replace(/\s+/g, '');
      return this.diasSemana.some(dia => 
        diasNormalizados.includes(dia.nombre.toLowerCase())
      );
    });

    // Calcular total de clases esperadas en la semana
    horariosValidos.forEach(horario => {
      const diasEnSemana = this.diasSemana.filter(dia => {
        const diasNormalizados = horario.dias?.toLowerCase().replace(/\s+/g, '') || '';
        return diasNormalizados.includes(dia.nombre.toLowerCase());
      }).length;
      this.weekStats.total += diasEnSemana;
    });

    // Contar asistencias por tipo
    this.asistencias.forEach(asistencia => {
      const tipo = asistencia.tipo_asistencia;
      const estado = asistencia.asistencia;

      if (tipo === 'checador' || tipo === 'Checador') {
        if (estado === 'Presente') this.weekStats.asistencias.checador++;
        else if (estado === 'Falta') this.weekStats.faltas.checador++;
        else if (estado === 'Retardo') this.weekStats.retardos.checador++;
      } else if (tipo === 'jefe' || tipo === 'Jefe') {
        if (estado === 'Presente') this.weekStats.asistencias.jefe++;
        else if (estado === 'Falta') this.weekStats.faltas.jefe++;
        else if (estado === 'Retardo') this.weekStats.retardos.jefe++;
      } else if (tipo === 'maestro' || tipo === 'Maestro' || tipo === 'Profesor') {
        if (estado === 'Presente') this.weekStats.asistencias.maestro++;
        else if (estado === 'Falta') this.weekStats.faltas.maestro++;
        else if (estado === 'Retardo') this.weekStats.retardos.maestro++;
      }
    });
  }

  getWeekStartDate(): string {
    const date = new Date(this.selectedDate);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    date.setDate(diff);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekEndDate(): string {
    const date = new Date(this.selectedDate);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + 6;
    date.setDate(diff);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekRange(): string {
    const startOfWeek = new Date(this.selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  }

  getEstadoText(estado?: string): string {
    switch (estado) {
      case 'Presente': return 'Presente';
      case 'Falta': return 'Falta';
      case 'Retardo': return 'Retardo';
      default: return 'Sin registro';
    }
  }

  getEstadoClass(estado?: string): string {
    switch (estado) {
      case 'Presente': return 'presente';
      case 'Falta': return 'ausente';
      case 'Retardo': return 'retardo';
      default: return 'sin-registro';
    }
  }

  getHorariosForDay(dia: string): HorarioMaestro[] {
    return this.horarios.filter(h => {
      if (!h.dias) return false;
      const diasNormalizados = h.dias.toLowerCase().replace(/\s+/g, '');
      const diaNormalizado = dia.toLowerCase();
      return diasNormalizados.includes(diaNormalizado);
    }).sort((a, b) => {
      // Ordenar por hora de inicio
      const horaA = a.hora_inicio || '';
      const horaB = b.hora_inicio || '';
      return horaA.localeCompare(horaB);
    });
  }

  getAsistenciaEstado(horarioId?: number, tipo: 'checador' | 'jefe' | 'maestro' = 'checador', dia?: string): string {
    if (!horarioId) return 'Sin registro';
    
    // Calcular la fecha específica del día en la semana seleccionada
    const fechaDia = this.getFechaDelDia(dia || '');
    
    // Mapear el tipo correctamente
    const tipoMap: any = {
      'checador': ['checador', 'Checador'],
      'jefe': ['jefe', 'Jefe'],
      'maestro': ['maestro', 'Maestro', 'Profesor']
    };
    
    const asistencia = this.asistencias.find(a => 
      a.horario_id === horarioId && 
      tipoMap[tipo].includes(a.tipo_asistencia) &&
      a.fecha === fechaDia
    );
    
    if (!asistencia) return 'Sin registro';
    
    return asistencia.asistencia || 'Sin registro';
  }

  // Obtener la fecha específica del día en la semana seleccionada
  getFechaDelDia(dia: string): string {
    const diasMap: { [key: string]: number } = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5
    };

    const startOfWeek = new Date(this.selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Agregar días según el día solicitado
    const targetDay = diasMap[dia] || 1;
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + (targetDay - 1));

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onMaestroChange() {
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  getWeekStartFormatted(): string {
    const startOfWeek = new Date(this.selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return startOfWeek.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  getWeekEndFormatted(): string {
    const startOfWeek = new Date(this.selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return endOfWeek.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  // Formatear fecha
  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  previousWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    this.selectedDate = newDate;
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  nextWeek() {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    this.selectedDate = newDate;
    if (this.selectedMaestro) {
      this.consultarAsistencias();
    }
  }

  handleCloseAlert() {
    this.error = null;
  }

  generarPDF() {
    if (!this.selectedMaestro) {
      this.error = 'Por favor seleccione un profesor';
      return;
    }

    const maestro = this.maestros.find(m => m.id === Number(this.selectedMaestro));
    if (!maestro) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Asistencias Semanales', pageWidth / 2, 20, { align: 'center' });

    // Información del profesor
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Profesor: ${maestro.name}`, 20, 35);
    doc.text(`Periodo: ${this.getWeekStartFormatted()} - ${this.getWeekEndFormatted()}`, 20, 42);

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(20, 48, pageWidth - 20, 48);

    // Estadísticas generales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Semanal', 20, 58);

    // Tabla de estadísticas
    const statsData = [
      ['Concepto', 'Checador', 'Jefe de Grupo', 'Profesor'],
      ['Total de Clases', this.weekStats.total.toString(), this.weekStats.total.toString(), this.weekStats.total.toString()],
      ['Presentes', this.weekStats.asistencias.checador.toString(), this.weekStats.asistencias.jefe.toString(), this.weekStats.asistencias.maestro.toString()],
      ['Retardos', this.weekStats.retardos.checador.toString(), this.weekStats.retardos.jefe.toString(), this.weekStats.retardos.maestro.toString()],
      ['Faltas', this.weekStats.faltas.checador.toString(), this.weekStats.faltas.jefe.toString(), this.weekStats.faltas.maestro.toString()],
      ['% Asistencia*', 
        this.calcularPorcentajeConRetardo(this.weekStats.asistencias.checador, this.weekStats.retardos.checador, this.weekStats.total),
        this.calcularPorcentajeConRetardo(this.weekStats.asistencias.jefe, this.weekStats.retardos.jefe, this.weekStats.total),
        this.calcularPorcentajeConRetardo(this.weekStats.asistencias.maestro, this.weekStats.retardos.maestro, this.weekStats.total)
      ]
    ];

    autoTable(doc, {
      startY: 65,
      head: [statsData[0]],
      body: statsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [240, 240, 240] }
      },
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // Obtener la posición Y después de la tabla de estadísticas
    const statsTableEndY = (doc as any).lastAutoTable.finalY || 110;

    // Detalle por día
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle por Día', 20, statsTableEndY + 15);

    let currentY = statsTableEndY + 22;

    this.diasSemana.forEach((dia, index) => {
      const horariosDelDia = this.getHorariosForDay(dia.nombre);
      
      if (horariosDelDia.length > 0) {
        // Verificar si necesitamos una nueva página
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        // Título del día
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 123, 255);
        doc.text(dia.nombre, 20, currentY);
        doc.setTextColor(0);
        
        currentY += 5;

        // Tabla de horarios del día
        const dayData = horariosDelDia.map(horario => [
          `${horario.hora_inicio} - ${horario.hora_fin}`,
          horario.materia?.name || 'N/A',
          horario.grupo?.name || 'N/A',
          this.getEstadoText(this.getAsistenciaEstado(horario.id, 'checador', dia.nombre)),
          this.getEstadoText(this.getAsistenciaEstado(horario.id, 'jefe', dia.nombre)),
          this.getEstadoText(this.getAsistenciaEstado(horario.id, 'maestro', dia.nombre))
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Hora', 'Materia', 'Grupo', 'Checador', 'Jefe', 'Profesor']],
          body: dayData,
          theme: 'striped',
          headStyles: { fillColor: [52, 152, 219], fontSize: 9 },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 40 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 }
          },
          didParseCell: (data: any) => {
            // Colorear las celdas según el estado
            if (data.section === 'body' && data.column.index >= 3) {
              const cellValue = data.cell.text[0];
              if (cellValue === 'Presente') {
                data.cell.styles.textColor = [21, 87, 36];
                data.cell.styles.fillColor = [212, 237, 218];
              } else if (cellValue === 'Falta') {
                data.cell.styles.textColor = [114, 28, 36];
                data.cell.styles.fillColor = [248, 215, 218];
              } else if (cellValue === 'Retardo') {
                data.cell.styles.textColor = [133, 100, 4];
                data.cell.styles.fillColor = [255, 243, 205];
              }
            }
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 10;
      }
    });

    // Nota explicativa
    const pageHeight = doc.internal.pageSize.getHeight();
    const lastTableEndY = (doc as any).lastAutoTable?.finalY || currentY;
    
    if (lastTableEndY < pageHeight - 40) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'italic');
      doc.text('* Nota: El porcentaje de asistencia considera retardos con valor de 0.5 (50% de asistencia)', 20, lastTableEndY + 10);
      doc.text('Fórmula: % = (Presentes + Retardos × 0.5) / Total × 100', 20, lastTableEndY + 16);
    }

    // Pie de página con fecha de generación
    const totalPages = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Generado el ${new Date().toLocaleDateString('es-ES')} - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Guardar el PDF
    const fileName = `Asistencias_${maestro.name.replace(/\s+/g, '_')}_${this.getWeekStartDate()}_${this.getWeekEndDate()}.pdf`;
    doc.save(fileName);
  }

  calcularPorcentaje(valor: number, total: number): string {
    if (total === 0) return '0%';
    return `${Math.round((valor / total) * 100)}%`;
  }

  calcularPorcentajeConRetardo(presentes: number, retardos: number, total: number): string {
    if (total === 0) return '0%';
    // Retardo cuenta como 0.5 de asistencia
    const valorPonderado = presentes + (retardos * 0.5);
    return `${Math.round((valorPonderado / total) * 100)}%`;
  }
}
