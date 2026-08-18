import React, { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import type { FurnitureItem } from '../../types/furniture';
import type { WallSide } from '../../types/project';
import {
  RotateCw,
  Copy,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Magnet,
} from 'lucide-react';


export const Canvas2D: React.FC = () => {
  const {
    activeRoom,
    furniture,
    selectedFurnitureId,
    setSelectedFurnitureId,
    selectedDoorId,
    setSelectedDoorId,
    selectedWindowId,
    setSelectedWindowId,
    updateFurniture,
    removeFurniture,
    duplicateFurniture,
    updateDoor,
    removeDoor,
    addDoor,
    addWindow,
    updateWindow,
    removeWindow,
    conflicts,
    walkingPaths,
    activeTheme,
  } = useProject();


  const { showWalkingPaths } = useUI();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Door dragging
  const [isDraggingDoor, setIsDraggingDoor] = useState<boolean>(false);
  const [activeDragDoorId, setActiveDragDoorId] = useState<string | null>(null);
  const [doorDragOffset, setDoorDragOffset] = useState<number>(0);

  const [zoom, setZoom] = useState<number>(1);
  const [snapToWallEnabled, setSnapToWallEnabled] = useState<boolean>(true);

  const scale = 42 * zoom;

  const roomWidthPx = activeRoom.dimensions.length * scale;
  const roomHeightPx = activeRoom.dimensions.width * scale;

  const selectedItem = furniture.find((f) => f.id === selectedFurnitureId);


  // -------------------------------------------------------------
  // Furniture Drag & Drop with Magnetic Wall Snapping
  // -------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent, item: FurnitureItem) => {
    e.stopPropagation();
    setSelectedDoorId(null);
    setSelectedFurnitureId(item.id);
    setActiveDragId(item.id);
    setIsDragging(true);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseXFt = (e.clientX - containerRect.left) / scale;
    const mouseYFt = (e.clientY - containerRect.top) / scale;

    setDragOffset({
      x: mouseXFt - item.x,
      y: mouseYFt - item.y,
    });
  };

  // Door mouse drag
  const handleDoorMouseDown = (e: React.MouseEvent, door: typeof activeRoom.doors[0]) => {
    e.stopPropagation();
    setSelectedFurnitureId(null);
    setSelectedDoorId(door.id);
    setActiveDragDoorId(door.id);
    setIsDraggingDoor(true);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseXFt = (e.clientX - containerRect.left) / scale;
    const mouseYFt = (e.clientY - containerRect.top) / scale;

    const isHorizontal = door.wall === 'north' || door.wall === 'south';
    const currentCoord = isHorizontal ? mouseXFt : mouseYFt;
    setDoorDragOffset(currentCoord - door.offset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Handle furniture dragging with smart boundary & magnetic wall snapping
    if (isDragging && activeDragId) {
      const mouseXFt = (e.clientX - containerRect.left) / scale;
      const mouseYFt = (e.clientY - containerRect.top) / scale;

      let newX = mouseXFt - dragOffset.x;
      let newY = mouseYFt - dragOffset.y;

      const item = furniture.find((f) => f.id === activeDragId);
      if (!item) return;

      const isRotated = Math.abs(item.rotation % 180) === 90;
      const effW = isRotated ? item.depth : item.width;
      const effD = isRotated ? item.width : item.depth;

      const roomL = activeRoom.dimensions.length;
      const roomW = activeRoom.dimensions.width;

      // Magnetic Wall Snapping (Snap flush if within 0.6 ft of walls)
      if (snapToWallEnabled) {
        if (newX < 0.6) newX = 0; // West Wall
        if (newY < 0.6) newY = 0; // North Wall
        if (newX > roomL - effW - 0.6) newX = roomL - effW; // East Wall
        if (newY > roomW - effD - 0.6) newY = roomW - effD; // South Wall
      }

      // Strict Room Boundary Clamping
      newX = Math.max(0, Math.min(roomL - effW, newX));
      newY = Math.max(0, Math.min(roomW - effD, newY));

      newX = Math.round(newX * 4) / 4;
      newY = Math.round(newY * 4) / 4;

      updateFurniture(activeDragId, { x: newX, y: newY });
    }

    // Handle door dragging along wall
    if (isDraggingDoor && activeDragDoorId) {
      const mouseXFt = (e.clientX - containerRect.left) / scale;
      const mouseYFt = (e.clientY - containerRect.top) / scale;

      const door = activeRoom.doors.find((d) => d.id === activeDragDoorId);
      if (!door) return;

      const isHorizontal = door.wall === 'north' || door.wall === 'south';
      const wallMax = isHorizontal ? activeRoom.dimensions.length : activeRoom.dimensions.width;
      const rawPos = isHorizontal ? mouseXFt : mouseYFt;

      let newOffset = rawPos - doorDragOffset;
      newOffset = Math.max(0.5, Math.min(wallMax - door.width - 0.5, newOffset));
      newOffset = Math.round(newOffset * 4) / 4;

      updateDoor(activeDragDoorId, { offset: newOffset });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveDragId(null);
    setIsDraggingDoor(false);
    setActiveDragDoorId(null);
  };

  // -------------------------------------------------------------
  // Furniture In-Place Actions
  // -------------------------------------------------------------
  const rotateSelectedItem = (degrees = 90) => {
    if (!selectedItem) return;
    const nextRot = (selectedItem.rotation + degrees) % 360;

    // Check if new rotated size fits inside room bounds
    const isNextRotated = Math.abs(nextRot % 180) === 90;
    const nextEffW = isNextRotated ? selectedItem.depth : selectedItem.width;
    const nextEffD = isNextRotated ? selectedItem.width : selectedItem.depth;

    let clampedX = Math.min(activeRoom.dimensions.length - nextEffW, Math.max(0, selectedItem.x));
    let clampedY = Math.min(activeRoom.dimensions.width - nextEffD, Math.max(0, selectedItem.y));
    clampedX = Math.round(clampedX * 4) / 4;
    clampedY = Math.round(clampedY * 4) / 4;

    updateFurniture(selectedItem.id, {
      rotation: nextRot,
      x: clampedX,
      y: clampedY,
    });
  };

  // Snap to Nearest Wall with optimal alignment
  const snapSelectedToNearestWall = () => {
    if (!selectedItem) return;
    const isRotated = Math.abs(selectedItem.rotation % 180) === 90;
    const effW = isRotated ? selectedItem.depth : selectedItem.width;
    const effD = isRotated ? selectedItem.width : selectedItem.depth;
    const roomL = activeRoom.dimensions.length;
    const roomW = activeRoom.dimensions.width;

    const distToNorth = selectedItem.y;
    const distToSouth = roomW - (selectedItem.y + effD);
    const distToWest = selectedItem.x;
    const distToEast = roomL - (selectedItem.x + effW);

    const minDist = Math.min(distToNorth, distToSouth, distToWest, distToEast);

    if (minDist === distToNorth) {
      updateFurniture(selectedItem.id, { y: 0, rotation: 0 });
    } else if (minDist === distToSouth) {
      updateFurniture(selectedItem.id, { y: roomW - effD, rotation: 180 });
    } else if (minDist === distToWest) {
      updateFurniture(selectedItem.id, { x: 0, rotation: 90 });
    } else {
      updateFurniture(selectedItem.id, { x: roomL - effW, rotation: 270 });
    }
  };

  // Door helpers
  const cycleDoorWall = (doorId: string, currentWall: WallSide) => {
    const wallOrder: WallSide[] = ['south', 'west', 'north', 'east'];
    const nextWall = wallOrder[(wallOrder.indexOf(currentWall) + 1) % wallOrder.length];
    updateDoor(doorId, { wall: nextWall, offset: 2.0 });
  };

  const cycleDoorSwing = (doorId: string, currentSwing: string) => {
    const swings: Array<'inside_left' | 'inside_right' | 'outside_left' | 'outside_right'> = [
      'inside_left',
      'inside_right',
      'outside_left',
      'outside_right',
    ];
    const nextSwing = swings[(swings.indexOf(currentSwing as any) + 1) % swings.length];
    updateDoor(doorId, { swing: nextSwing });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => {
        setSelectedFurnitureId(null);
        setSelectedDoorId(null);
      }}
      className="w-full h-full bg-[#FAF9F5] dark:bg-[#090C10] bg-blueprint-grid overflow-hidden relative flex items-center justify-center select-none font-sans"
    >
      {/* 2D Room Blueprint Canvas Container */}
      <div
        className="relative transition-transform duration-75 shadow-2xl rounded-sm"
        style={{
          width: `${roomWidthPx}px`,
          height: `${roomHeightPx}px`,
        }}
      >
        {/* Floor Surface */}
        <div
          className="absolute inset-0 bg-white dark:bg-[#12161E] border-[10px] border-neutral-900 dark:border-[#1E232B] shadow-inner"
          style={{
            backgroundColor: activeTheme.palette.walls || '#FFFFFF',
          }}
        >
          {/* Floor Material Wash */}
          <div
            className="w-full h-full opacity-20"
            style={{ backgroundColor: activeTheme.palette.flooring }}
          />

          {/* Architectural Blueprint Grid Pattern */}
          <div
            className="w-full h-full opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle, #737373 1px, transparent 1px)`,
              backgroundSize: `${scale / 2}px ${scale / 2}px`,
            }}
          />
        </div>

        {/* North Wall Dimension Tag */}
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-between text-neutral-800 dark:text-neutral-200 font-mono text-[11px] font-bold">
          <div className="h-3 w-px bg-neutral-800 dark:bg-neutral-300" />
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#161B22] px-2.5 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700 shadow-2xs">
            <span className="text-[#B26A4A] dark:text-[#D4AF37]">↔</span>
            <span>{activeRoom.dimensions.length}' Length ({(activeRoom.dimensions.length * 0.3048).toFixed(1)}m)</span>
          </div>
          <div className="h-3 w-px bg-neutral-800 dark:bg-neutral-300" />
        </div>

        {/* West Wall Dimension Tag */}
        <div className="absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-between text-neutral-800 dark:text-neutral-200 font-mono text-[11px] font-bold">
          <div className="w-3 h-px bg-neutral-800 dark:bg-neutral-300" />
          <div className="flex items-center gap-1 bg-white dark:bg-[#161B22] px-2 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700 shadow-2xs -rotate-90 whitespace-nowrap">
            <span className="text-[#B26A4A] dark:text-[#D4AF37]">↕</span>
            <span>{activeRoom.dimensions.width}' Width ({(activeRoom.dimensions.width * 0.3048).toFixed(1)}m)</span>
          </div>
          <div className="w-3 h-px bg-neutral-800 dark:bg-neutral-300" />
        </div>

        {/* Dynamic Walking Clearance Paths Overlay */}
        {showWalkingPaths &&
          walkingPaths.map((path) => {
            const allPoints = [path.fromCoords, ...(path.waypoints || []), path.toCoords];
            return (
              <svg
                key={path.id}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                <polyline
                  points={allPoints.map((p) => `${p.x * scale},${p.y * scale}`).join(' ')}
                  fill="none"
                  stroke={path.clearanceCm >= 90 ? '#10B981' : '#F59E0B'}
                  strokeWidth={path.clearanceCm >= 90 ? 3 : 2}
                  strokeDasharray="4 4"
                  strokeOpacity={0.65}
                />
              </svg>
            );
          })}


        {/* Windows on Walls (Multi-Wall Orientation & Exact Sizes) */}
        {activeRoom.windows.map((win) => {
          const winW = (win.width || 5.0) * scale;
          let winStyle: React.CSSProperties = {};
          let labelText = `${win.width || 5}' Window`;

          if (win.wall === 'north') {
            winStyle = { top: -6, left: `${win.offset * scale}px`, width: `${winW}px`, height: 12 };
          } else if (win.wall === 'south') {
            winStyle = { bottom: -6, left: `${win.offset * scale}px`, width: `${winW}px`, height: 12 };
          } else if (win.wall === 'west') {
            winStyle = { left: -6, top: `${win.offset * scale}px`, height: `${winW}px`, width: 12 };
          } else {
            winStyle = { right: -6, top: `${win.offset * scale}px`, height: `${winW}px`, width: 12 };
          }

          return (
            <div
              key={win.id}
              style={winStyle}
              className="absolute bg-sky-400 dark:bg-sky-500 border-2 border-sky-700 dark:border-sky-300 z-15 flex items-center justify-center shadow-xs"
              title={`${win.wall.toUpperCase()} Wall Window • ${win.width} ft Wide`}
            >
              <span className="text-[7px] font-mono font-bold text-sky-950 uppercase px-0.5 truncate">
                {labelText}
              </span>
            </div>
          );
        })}

        {/* Doors with Swing Arcs & Drag Handles */}
        {activeRoom.doors.map((door) => {
          const isDoorSelected = door.id === selectedDoorId;
          const doorWidthPx = door.width * scale;

          let doorStyle: React.CSSProperties = {};
          let arcStyle: React.CSSProperties = {};

          if (door.wall === 'south') {
            doorStyle = { bottom: -7, left: `${door.offset * scale}px`, width: `${doorWidthPx}px`, height: 14 };
            arcStyle = {
              bottom: 4,
              left: `${door.offset * scale}px`,
              width: `${doorWidthPx}px`,
              height: `${doorWidthPx}px`,
              borderTopRightRadius: '100%',
              borderTop: '2px dashed #D97706',
              borderRight: '2px dashed #D97706',
            };
          } else if (door.wall === 'north') {
            doorStyle = { top: -7, left: `${door.offset * scale}px`, width: `${doorWidthPx}px`, height: 14 };
            arcStyle = {
              top: 4,
              left: `${door.offset * scale}px`,
              width: `${doorWidthPx}px`,
              height: `${doorWidthPx}px`,
              borderBottomRightRadius: '100%',
              borderBottom: '2px dashed #D97706',
              borderRight: '2px dashed #D97706',
            };
          } else if (door.wall === 'west') {
            doorStyle = { left: -7, top: `${door.offset * scale}px`, height: `${doorWidthPx}px`, width: 14 };
            arcStyle = {
              left: 4,
              top: `${door.offset * scale}px`,
              width: `${doorWidthPx}px`,
              height: `${doorWidthPx}px`,
              borderBottomRightRadius: '100%',
              borderBottom: '2px dashed #D97706',
              borderRight: '2px dashed #D97706',
            };
          } else {
            doorStyle = { right: -7, top: `${door.offset * scale}px`, height: `${doorWidthPx}px`, width: 14 };
            arcStyle = {
              right: 4,
              top: `${door.offset * scale}px`,
              width: `${doorWidthPx}px`,
              height: `${doorWidthPx}px`,
              borderBottomLeftRadius: '100%',
              borderBottom: '2px dashed #D97706',
              borderLeft: '2px dashed #D97706',
            };
          }

          return (
            <React.Fragment key={door.id}>
              {/* Swing Arc Projection */}
              <div style={arcStyle} className="absolute pointer-events-none bg-amber-500/10 z-5" />

              {/* Draggable Door Opening Slab */}
              <div
                style={doorStyle}
                onMouseDown={(e) => handleDoorMouseDown(e, door)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFurnitureId(null);
                  setSelectedDoorId(door.id);
                }}
                className={`absolute z-20 cursor-grab active:cursor-grabbing flex items-center justify-center transition-all ${
                  isDoorSelected
                    ? 'bg-amber-400 border-2 border-amber-600 shadow-lg ring-2 ring-amber-400/50'
                    : 'bg-amber-500 hover:bg-amber-400 border-2 border-neutral-900 shadow-xs'
                }`}
                title={`Click & drag to move door along wall (${door.offset} ft from corner)`}
              >
                <span className="text-[8px] font-bold text-neutral-950 truncate px-0.5">
                  🚪 {door.width}'
                </span>

                {/* Floating Door Control Bar when Selected */}
                {isDoorSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-950 text-white rounded-xl shadow-2xl p-1 flex items-center gap-1.5 z-40 pointer-events-auto text-[11px] whitespace-nowrap"
                  >
                    <span className="text-[10px] font-bold text-amber-400 px-1">
                      Wall: {door.wall.toUpperCase()}
                    </span>

                    <button
                      onClick={() => cycleDoorWall(door.id, door.wall)}
                      title="Move door to next wall"
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-[#D4B996]" />
                      <span>Flip Wall</span>
                    </button>

                    <button
                      onClick={() => cycleDoorSwing(door.id, door.swing)}
                      title="Flip door swing direction"
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-bold"
                    >
                      Flip Swing
                    </button>

                    <button
                      onClick={() => removeDoor(door.id)}
                      title="Delete door"
                      className="p-1 hover:bg-red-900 rounded-lg text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* ------------------------------------------------------------- */}
        {/* ARCHITECTURAL WINDOW OPENINGS (CYAN SLABS) */}
        {/* ------------------------------------------------------------- */}
        {(activeRoom.windows || []).map((win) => {
          const isWinSelected = win.id === selectedWindowId;
          const winWidthPx = win.width * scale;

          let winStyle: React.CSSProperties = {};
          if (win.wall === 'north') {
            winStyle = { top: -7, left: `${win.offset * scale}px`, width: `${winWidthPx}px`, height: 14 };
          } else if (win.wall === 'south') {
            winStyle = { bottom: -7, left: `${win.offset * scale}px`, width: `${winWidthPx}px`, height: 14 };
          } else if (win.wall === 'west') {
            winStyle = { left: -7, top: `${win.offset * scale}px`, height: `${winWidthPx}px`, width: 14 };
          } else {
            winStyle = { right: -7, top: `${win.offset * scale}px`, height: `${winWidthPx}px`, width: 14 };
          }

          return (
            <div
              key={win.id}
              style={winStyle}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFurnitureId(null);
                setSelectedDoorId(null);
                setSelectedWindowId(win.id);
              }}
              className={`absolute z-20 cursor-pointer flex items-center justify-center transition-all ${
                isWinSelected
                  ? 'bg-sky-400 border-2 border-sky-600 shadow-lg ring-2 ring-sky-400/50'
                  : 'bg-sky-500 hover:bg-sky-400 border-2 border-neutral-900 shadow-xs'
              }`}
              title={`Window (${win.width}' on ${win.wall.toUpperCase()} wall)`}
            >
              <span className="text-[8px] font-bold text-neutral-950 truncate px-0.5">
                🪟 {win.width}'
              </span>

              {isWinSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-11 left-1/2 -translate-x-1/2 bg-neutral-950 text-white rounded-xl shadow-2xl p-1 flex items-center gap-1.5 z-40 pointer-events-auto text-[11px] whitespace-nowrap"
                >
                  <span className="text-[10px] font-bold text-sky-400 px-1">
                    {win.wall.toUpperCase()} WALL
                  </span>
                  <button
                    onClick={() => {
                      const walls: WallSide[] = ['north', 'east', 'south', 'west'];
                      const nextIdx = (walls.indexOf(win.wall) + 1) % 4;
                      updateWindow(win.id, { wall: walls[nextIdx], offset: 2.0 });
                    }}
                    className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-bold"
                  >
                    Flip Wall
                  </button>
                  <button
                    onClick={() => removeWindow(win.id)}
                    className="p-1 hover:bg-red-900 rounded text-red-400"
                    title="Delete Window"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}


        {/* Structural Obstacles / Columns */}
        {activeRoom.obstacles.map((obs) => (
          <div
            key={obs.id}
            style={{
              left: `${obs.x * scale}px`,
              top: `${obs.y * scale}px`,
              width: `${obs.width * scale}px`,
              height: `${obs.depth * scale}px`,
            }}
            className="absolute bg-neutral-900 border border-neutral-700 z-15 flex items-center justify-center text-white text-[8px] font-mono"
          >
            {obs.name}
          </div>
        ))}

        {/* ------------------------------------------------------------- */}
        {/* FURNITURE PIECES: ACCURATE ROTATION & IN-PLACE ACTIONS */}
        {/* ------------------------------------------------------------- */}
        {furniture.map((item) => {
          const isSelected = item.id === selectedFurnitureId;
          const isRotated = Math.abs(item.rotation % 180) === 90;
          const effW = isRotated ? item.depth : item.width;
          const effD = isRotated ? item.width : item.depth;

          const itemConflicts = conflicts.filter((c) => c.affectedFurnitureIds.includes(item.id));
          const hasError = itemConflicts.some((c) => c.severity === 'alert');
          const hasWarning = itemConflicts.some((c) => c.severity === 'caution');

          return (
            <div
              key={item.id}
              onMouseDown={(e) => handleMouseDown(e, item)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDoorId(null);
                setSelectedFurnitureId(item.id);
              }}
              style={{
                left: `${item.x * scale}px`,
                top: `${item.y * scale}px`,
                width: `${effW * scale}px`,
                height: `${effD * scale}px`,
              }}
              className={`absolute cursor-move transition-shadow z-20 flex flex-col items-center justify-center p-1 rounded-sm ${
                isSelected
                  ? 'ring-3 ring-[#D4AF37] shadow-2xl z-30'
                  : 'hover:ring-1 hover:ring-neutral-400'
              } ${
                hasError
                  ? 'bg-red-100/95 dark:bg-red-950/80 border-2 border-red-500 text-red-950 dark:text-red-200'
                  : hasWarning
                  ? 'bg-amber-100/95 dark:bg-amber-950/80 border-2 border-amber-500 text-amber-950 dark:text-amber-200'
                  : 'bg-[#6E472A]/90 dark:bg-[#4E311A] border-2 border-neutral-900 dark:border-neutral-600 text-white'
              }`}
            >
              {/* Furniture Inner Header Block */}
              <div className="flex items-center gap-1 leading-tight truncate w-full justify-center px-0.5">
                <span className="text-[10px] font-extrabold truncate">{item.name}</span>
                {item.rotation > 0 && (
                  <span className="text-[8px] font-mono text-[#D4AF37] bg-black/40 px-1 rounded">
                    {item.rotation}°
                  </span>
                )}
              </div>

              <span className="text-[9px] font-mono opacity-85 mt-0.5">
                {item.width} × {item.depth} ft
              </span>

              {/* Spatial Conflict Warning Marker */}
              {hasError && (
                <div className="absolute -bottom-3.5 left-0 right-0 flex items-center justify-center text-[8px] font-mono">
                  <span className="flex items-center gap-0.5 text-red-700 dark:text-red-300 font-bold bg-white dark:bg-red-950 px-1.5 py-0.2 rounded shadow-xs border border-red-300 dark:border-red-700">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                    Conflict
                  </span>
                </div>
              )}

              {/* Selected In-Canvas Quick Action HUD */}
              {isSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-950 text-white rounded-xl shadow-2xl p-1 flex items-center gap-1 z-40 pointer-events-auto whitespace-nowrap animate-fadeIn border border-[#30363D]"
                >
                  <button
                    onClick={() => rotateSelectedItem(90)}
                    title="Rotate 90°"
                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-[#D4AF37] flex items-center gap-1 text-[11px] font-bold"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>90°</span>
                  </button>

                  <button
                    onClick={() => rotateSelectedItem(45)}
                    title="Rotate 45°"
                    className="px-2 py-1 hover:bg-neutral-800 rounded-lg text-neutral-200 text-[10px] font-bold"
                  >
                    45°
                  </button>

                  <button
                    onClick={snapSelectedToNearestWall}
                    title="Snap Flush to Wall"
                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Magnet className="w-3 h-3 text-[#D4AF37]" />
                    <span>Stick Wall</span>
                  </button>

                  <button
                    onClick={() => duplicateFurniture(item.id)}
                    title="Duplicate Item"
                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeFurniture(item.id)}
                    title="Delete Piece"
                    className="p-1.5 hover:bg-red-900 rounded-lg text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2D Canvas Bottom Toolbar: Wall Snap, Door Tool & Zoom */}
      <div className="absolute bottom-5 left-5 bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] shadow-md flex items-center gap-3 text-xs font-mono text-neutral-700 dark:text-neutral-200 z-30 pointer-events-auto">
        <button
          onClick={() => {
            setSelectedFurnitureId(null);
            setSelectedWindowId(null);
            addDoor({
              name: 'Entry Door',
              wall: 'south',
              offset: 2.0,
              width: 3.0,
              swing: 'inside_left',
            });
          }}
          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-lg text-xs font-bold font-sans flex items-center gap-1 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-[#D4B996] dark:text-[#8C5232]" />
          <span>+ Add Door</span>
        </button>

        <button
          onClick={() => {
            setSelectedFurnitureId(null);
            setSelectedDoorId(null);
            addWindow({
              name: 'Window',
              wall: 'north',
              offset: 3.5,
              width: 4.0,
              height: 4.0,
              sillHeight: 3.0,
            });
          }}
          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 dark:bg-sky-700 dark:hover:bg-sky-600 text-white rounded-lg text-xs font-bold font-sans flex items-center gap-1 transition-all active:scale-95 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Window</span>
        </button>

        <span className="text-neutral-300 dark:text-neutral-700">|</span>


        {/* Magnetic Wall Snap Toggle */}
        <button
          onClick={() => setSnapToWallEnabled(!snapToWallEnabled)}
          title="Toggle Magnetic Wall Snapping"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition-all ${
            snapToWallEnabled
              ? 'bg-[#FAF4ED] dark:bg-[#2A2318] text-[#8C5232] dark:text-[#D4AF37] border border-[#E5D4C4] dark:border-[#523E28]'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Stick Wall: {snapToWallEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <span className="text-neutral-300 dark:text-neutral-700">|</span>

        {/* Zoom Steppers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
            className="w-6 h-6 bg-neutral-100 dark:bg-[#21262D] hover:bg-neutral-200 dark:hover:bg-[#30363D] text-neutral-800 dark:text-white rounded-lg flex items-center justify-center font-bold"
          >
            -
          </button>
          <span className="px-1 text-xs">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(1.8, zoom + 0.1))}
            className="w-6 h-6 bg-neutral-100 dark:bg-[#21262D] hover:bg-neutral-200 dark:hover:bg-[#30363D] text-neutral-800 dark:text-white rounded-lg flex items-center justify-center font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
