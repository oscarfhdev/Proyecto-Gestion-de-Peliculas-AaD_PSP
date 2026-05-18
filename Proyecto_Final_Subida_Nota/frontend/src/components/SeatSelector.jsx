import { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Tag, message, Divider } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    VideoCameraOutlined,
    DollarOutlined,
    CloseOutlined,
    MinusOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

/**
 * Selector visual de butacas estilo cine real.
 * Muestra la pantalla, filas de asientos con colores, y resumen de compra.
 */
const SeatSelector = ({ visible, onCancel, funcion, onConfirm, occupiedSeats = [] }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Reset seats when modal opens with new function
    useEffect(() => {
        if (visible) setSelectedSeats([]);
    }, [visible, funcion?.id]);

    // Calculate seat layout from sala capacity
    const seatsPerRow = 14;
    const totalCapacity = funcion?.salaCapacidad || funcion?.asientosDisponibles || 120;
    const totalRows = Math.ceil(totalCapacity / seatsPerRow);

    // Row labels (A, B, C, ...)
    const rowLabels = useMemo(() => {
        return Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i));
    }, [totalRows]);

    // Check if a seat is occupied
    const isOccupied = (row, seat) => {
        return occupiedSeats.some(s => s.fila === row && s.asiento === seat);
    };

    // Check if selected
    const isSelected = (row, seat) => {
        return selectedSeats.some(s => s.fila === row && s.asiento === seat);
    };

    // Toggle seat selection
    const toggleSeat = (row, seat) => {
        if (isOccupied(row, seat)) return;
        setSelectedSeats(prev => {
            const exists = prev.some(s => s.fila === row && s.asiento === seat);
            if (exists) return prev.filter(s => !(s.fila === row && s.asiento === seat));
            if (prev.length >= 8) {
                message.warning('Máximo 8 entradas por compra');
                return prev;
            }
            return [...prev, { fila: row, asiento: seat }];
        });
    };

    // Seat type based on position (VIP center rows, standard sides)
    const getSeatType = (rowIdx, seatIdx) => {
        const isCenter = seatIdx >= 4 && seatIdx <= 9;
        const isMidRows = rowIdx >= Math.floor(totalRows * 0.3) && rowIdx <= Math.floor(totalRows * 0.7);
        if (isCenter && isMidRows) return 'vip';
        return 'standard';
    };

    const precio = funcion?.precio || 0;
    const total = selectedSeats.length * precio;

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            message.warning('Selecciona al menos un asiento');
            return;
        }
        onConfirm(selectedSeats);
    };

    if (!funcion) return null;

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={820}
            centered
            destroyOnHidden
            closeIcon={<span className="text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-colors">✕</span>}
            styles={{
                content: { padding: 0, backgroundColor: '#0a0a0a', borderRadius: 16, overflow: 'hidden', border: '1px solid #222' },
                body: { padding: 0 },
                mask: { backdropFilter: 'blur(8px)' }
            }}
        >
            <div className="flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Header con info de la función */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1">{funcion.peliculaTitulo}</h2>
                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <CalendarOutlined className="text-red-500" />
                                    {dayjs(funcion.fechaHora).format('DD/MM/YYYY')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ClockCircleOutlined className="text-red-500" />
                                    {dayjs(funcion.fechaHora).format('HH:mm')}h
                                </span>
                                <span className="flex items-center gap-1">
                                    <VideoCameraOutlined className="text-red-500" />
                                    {funcion.salaNombre}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-green-400 text-2xl font-black">{precio.toFixed(2)}€</div>
                            <div className="text-gray-500 text-xs">por entrada</div>
                        </div>
                    </div>
                </div>

                {/* Seat map area */}
                <div className="px-2 sm:px-6 pb-2 overflow-y-auto overflow-x-auto" style={{ maxHeight: '55vh' }}>
                    {/* PANTALLA DE CINE */}
                    <div className="relative mb-8 mx-auto" style={{ maxWidth: 600 }}>
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-cyan-500/20 blur-xl rounded-full"></div>
                            {/* Screen shape */}
                            <div
                                className="mx-auto h-2 rounded-b-[50%]"
                                style={{
                                    background: 'linear-gradient(180deg, #67e8f9 0%, #22d3ee 50%, #0891b2 100%)',
                                    width: '85%',
                                    boxShadow: '0 0 30px rgba(103, 232, 249, 0.3), 0 0 60px rgba(103, 232, 249, 0.1)',
                                }}
                            ></div>
                            <p className="text-center text-cyan-400/60 text-[10px] uppercase tracking-[0.3em] mt-3 font-medium">
                                Pantalla
                            </p>
                        </div>
                    </div>

                    {/* SEATS GRID */}
                    <div className="flex flex-col items-center gap-[4px] sm:gap-[6px] mb-6 seat-grid-container" style={{ maxWidth: 600, margin: '0 auto', minWidth: 'fit-content' }}>
                        {rowLabels.map((label, rowIdx) => {
                            // Calculate seats in this row (last row may have fewer)
                            const seatsInRow = rowIdx === totalRows - 1 
                                ? (totalCapacity % seatsPerRow || seatsPerRow) 
                                : seatsPerRow;
                            
                            // Add slight curve to rows
                            const curveOffset = Math.abs(rowIdx - totalRows / 2);
                            const rowPadding = Math.max(0, (totalRows / 2 - curveOffset) * 0.5);

                            return (
                                <div key={label} className="flex items-center gap-1 w-full justify-center"
                                    style={{ paddingLeft: `${rowPadding}px`, paddingRight: `${rowPadding}px` }}>
                                    {/* Row label left */}
                                    <span className="text-gray-600 text-[10px] w-4 text-right font-mono shrink-0">{label}</span>
                                    
                                    {/* Seats */}
                                    <div className="flex gap-[2px] sm:gap-[3px] justify-center flex-1">
                                        {Array.from({ length: seatsInRow }, (_, seatIdx) => {
                                            const fila = rowIdx + 1;
                                            const asiento = seatIdx + 1;
                                            const occupied = isOccupied(fila, asiento);
                                            const selected = isSelected(fila, asiento);
                                            const seatType = getSeatType(rowIdx, seatIdx);
                                            
                                            // Aisle gaps
                                            const hasLeftGap = seatIdx === 3;
                                            const hasRightGap = seatIdx === seatsPerRow - 4;

                                            return (
                                                <div key={seatIdx} 
                                                    className={`${hasLeftGap ? 'sm:mr-2 mr-0.5' : ''} ${hasRightGap ? 'sm:ml-2 ml-0.5' : ''}`}>
                                                    <button
                                                        onClick={() => toggleSeat(fila, asiento)}
                                                        disabled={occupied}
                                                        title={occupied ? 'Ocupado' : `Fila ${label} - Asiento ${asiento}${seatType === 'vip' ? ' (VIP)' : ''}`}
                                                        className={`
                                                            w-[22px] h-[20px] sm:w-[28px] sm:h-[24px] rounded-t-lg rounded-b-sm text-[7px] sm:text-[8px] font-bold
                                                            transition-all duration-200 border-b-2 relative
                                                            ${occupied
                                                                ? 'bg-red-900/80 border-red-900 cursor-not-allowed text-transparent'
                                                                : selected
                                                                    ? 'bg-green-500 border-green-600 text-white scale-110 shadow-lg shadow-green-500/30 z-10'
                                                                    : seatType === 'vip'
                                                                        ? 'bg-yellow-600/40 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/60 hover:border-yellow-500 hover:scale-105 hover:text-yellow-400 cursor-pointer'
                                                                        : 'bg-zinc-700/50 border-zinc-600/50 text-zinc-500/60 hover:bg-zinc-600 hover:border-zinc-500 hover:scale-105 hover:text-zinc-300 cursor-pointer'
                                                            }
                                                        `}
                                                    >
                                                        {selected ? '✓' : asiento}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Row label right */}
                                    <span className="text-gray-600 text-[10px] w-4 text-left font-mono shrink-0">{label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* LEYENDA */}
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-4 rounded-t-md rounded-b-sm bg-zinc-700/50 border-b-2 border-zinc-600/50"></div>
                            <span className="text-gray-500 text-xs">Disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-4 rounded-t-md rounded-b-sm bg-yellow-600/40 border-b-2 border-yellow-500/50"></div>
                            <span className="text-gray-500 text-xs">VIP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-4 rounded-t-md rounded-b-sm bg-green-500 border-b-2 border-green-600"></div>
                            <span className="text-gray-500 text-xs">Seleccionado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-4 rounded-t-md rounded-b-sm bg-red-900/80 border-b-2 border-red-900"></div>
                            <span className="text-gray-500 text-xs">Ocupado</span>
                        </div>
                    </div>
                </div>

                {/* RESUMEN Y CONFIRMAR */}
                <div className="px-8 py-6 border-t border-zinc-800" style={{ backgroundColor: '#111' }}>
                    {selectedSeats.length > 0 ? (
                        <>
                            {/* Selected seats summary */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedSeats.map(s => (
                                    <Tag
                                        key={`${s.fila}-${s.asiento}`}
                                        closable
                                        onClose={() => toggleSeat(s.fila, s.asiento)}
                                        className="bg-green-500/20 border-green-500/40 text-green-400 font-mono"
                                    >
                                        {String.fromCharCode(64 + s.fila)}{s.asiento}
                                    </Tag>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-gray-400">
                                    <span className="font-bold text-white">{selectedSeats.length}</span> entrada{selectedSeats.length > 1 ? 's' : ''} × {precio.toFixed(2)}€
                                </div>
                                <div className="text-green-400 text-3xl font-black">
                                    {total.toFixed(2)}€
                                </div>
                            </div>

                            <Button
                                block
                                size="large"
                                icon={<CheckCircleOutlined />}
                                onClick={handleConfirm}
                                style={{
                                    backgroundColor: '#E50914',
                                    color: 'white',
                                    border: 'none',
                                    height: 56,
                                    fontWeight: 'bold',
                                    fontSize: '1.15rem',
                                    borderRadius: 12,
                                }}
                            >
                                Confirmar {selectedSeats.length} Entrada{selectedSeats.length > 1 ? 's' : ''} — {total.toFixed(2)}€
                            </Button>
                        </>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-gray-500 text-sm">Selecciona tus asientos en el plano de la sala</p>
                            <p className="text-gray-600 text-xs mt-1">Máximo 8 entradas por compra</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SeatSelector;
