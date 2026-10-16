"use client";

import React from "react";
import { SlideWidget } from "@/lib/types";
import {
  Bold,
  Italic,
  Trash2,
  Copy,
  Columns,
  Quote,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Play,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface SmartWidgetBlockProps {
  widget: SlideWidget;
  selected: boolean;
  readOnly?: boolean;
  isLightSurface?: boolean;
  accentColor?: string;
  onSelect?: () => void;
  onChange?: (updated: SlideWidget) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function SmartWidgetBlock({
  widget,
  selected,
  readOnly = false,
  isLightSurface = false,
  accentColor = "#8b5cf6",
  onSelect,
  onChange,
  onDuplicate,
  onDelete
}: SmartWidgetBlockProps) {
  const colSpan = Math.min(12, Math.max(3, widget.colSpan || 4));

  function updateField(patch: Partial<SlideWidget>) {
    if (readOnly || !onChange) return;
    onChange({ ...widget, ...patch });
  }

  function updateStyle(stylePatch: NonNullable<SlideWidget["style"]>) {
    if (readOnly || !onChange) return;
    onChange({
      ...widget,
      style: { ...(widget.style || {}), ...stylePatch }
    });
  }

  const cardSurface = isLightSurface
    ? "bg-black/[0.04] border-black/10 text-zinc-900"
    : "bg-white/[0.04] border-white/10 text-white";

  const mutedText = isLightSurface ? "text-zinc-600" : "text-zinc-400";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!readOnly) onSelect?.();
      }}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`
      }}
      className={`relative rounded-2xl border p-5 transition-all flex flex-col justify-between ${cardSurface} ${
        selected && !readOnly
          ? "ring-2 ring-violet-500 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.25)] z-20"
          : !readOnly
          ? "hover:border-white/25 cursor-pointer"
          : ""
      }`}
    >
      {/* Contextual Floating Widget Toolbar when selected */}
      {selected && !readOnly && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-11 left-2 z-30 flex items-center gap-1 px-2 py-1 rounded-xl bg-[#161622] border border-white/15 shadow-2xl text-xs text-zinc-200"
        >
          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[10px] uppercase">
            {widget.type}
          </span>

          <div className="h-3.5 w-[1px] bg-white/10 mx-1" />

          {/* Column Span Selector */}
          <div className="flex items-center gap-0.5">
            <Columns className="w-3 h-3 text-zinc-400 mr-1" />
            {[4, 6, 8, 12].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => updateField({ colSpan: cols })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  colSpan === cols
                    ? "bg-violet-600 text-white"
                    : "hover:bg-white/10 text-zinc-400"
                }`}
              >
                {cols}c
              </button>
            ))}
          </div>

          <div className="h-3.5 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            onClick={() => updateStyle({ bold: !widget.style?.bold })}
            className={`p-1 rounded ${
              widget.style?.bold ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Toggle Bold"
          >
            <Bold className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => updateStyle({ italic: !widget.style?.italic })}
            className={`p-1 rounded ${
              widget.style?.italic ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Toggle Italic"
          >
            <Italic className="w-3 h-3" />
          </button>

          <div className="h-3.5 w-[1px] bg-white/10 mx-1" />

          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 rounded text-zinc-300 hover:bg-white/10 hover:text-white"
            title="Duplicate Widget"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
            title="Delete Widget"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Badge / Eyebrow */}
      {widget.badge !== undefined && (
        <div className="mb-2">
          {readOnly ? (
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${accentColor}22`,
                color: isLightSurface ? accentColor : "#c4b5fd"
              }}
            >
              {widget.badge}
            </span>
          ) : (
            <input
              type="text"
              value={widget.badge}
              onChange={(e) => updateField({ badge: e.target.value })}
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-transparent focus:border-violet-400 focus:outline-none w-auto max-w-full"
            />
          )}
        </div>
      )}

      {/* Render specific widget type body */}
      {widget.type === "heading" && (
        <div className="space-y-2">
          {readOnly ? (
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              {widget.title}
            </h3>
          ) : (
            <input
              type="text"
              value={widget.title || ""}
              onChange={(e) => updateField({ title: e.target.value })}
              placeholder="Headline..."
              className="w-full bg-transparent text-2xl md:text-3xl font-bold tracking-tight focus:outline-none"
            />
          )}
          {(widget.subtitle !== undefined || !readOnly) &&
            (readOnly ? (
              <p className={`text-sm ${mutedText}`}>{widget.subtitle}</p>
            ) : (
              <input
                type="text"
                value={widget.subtitle || ""}
                onChange={(e) => updateField({ subtitle: e.target.value })}
                placeholder="Supporting subtitle..."
                className={`w-full bg-transparent text-sm ${mutedText} focus:outline-none`}
              />
            ))}
        </div>
      )}

      {(widget.type === "metric" ||
        widget.type === "StatBox" ||
        widget.type === "fact" ||
        widget.type === "numbers" ||
        widget.type === "progress-ring") && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            {readOnly ? (
              <span className="text-3xl md:text-4xl font-bold tracking-tight">
                {widget.value || "94%"}
              </span>
            ) : (
              <input
                type="text"
                value={widget.value || ""}
                onChange={(e) => updateField({ value: e.target.value })}
                placeholder="$0.0M"
                className="w-36 bg-transparent text-3xl md:text-4xl font-bold tracking-tight focus:outline-none"
              />
            )}
            {(widget.delta !== undefined || !readOnly) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                {readOnly ? (
                  widget.delta
                ) : (
                  <input
                    type="text"
                    value={widget.delta || ""}
                    onChange={(e) => updateField({ delta: e.target.value })}
                    placeholder="+24%"
                    className="w-20 bg-transparent text-emerald-400 focus:outline-none"
                  />
                )}
              </span>
            )}
          </div>
          {readOnly ? (
            <div className="text-sm font-semibold">{widget.title}</div>
          ) : (
            <input
              type="text"
              value={widget.title || ""}
              onChange={(e) => updateField({ title: e.target.value })}
              placeholder="Metric label..."
              className="w-full bg-transparent text-sm font-semibold focus:outline-none"
            />
          )}
          {(widget.content !== undefined || !readOnly) &&
            (readOnly ? (
              <p className={`text-xs ${mutedText}`}>{widget.content}</p>
            ) : (
              <input
                type="text"
                value={widget.content || ""}
                onChange={(e) => updateField({ content: e.target.value })}
                placeholder="Context or benchmark..."
                className={`w-full bg-transparent text-xs ${mutedText} focus:outline-none`}
              />
            ))}
        </div>
      )}

      {(widget.type === "chart" ||
        widget.type === "chart-bar" ||
        widget.type === "chart-line" ||
        widget.type === "funnel" ||
        widget.type === "pyramid") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {readOnly ? (
              <div className="text-sm font-bold">{widget.title}</div>
            ) : (
              <input
                type="text"
                value={widget.title || ""}
                onChange={(e) => updateField({ title: e.target.value })}
                className="bg-transparent text-sm font-bold focus:outline-none flex-1"
              />
            )}
            {widget.subtitle && (
              <span className={`text-xs ${mutedText}`}>{widget.subtitle}</span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 items-end h-32 pt-4 px-2">
            {(widget.chartData
              ? widget.chartData.map((d, idx) => ({
                  id: `cd-${idx}`,
                  label: d.label,
                  value: String(d.value),
                  progress: Math.min(100, Math.max(25, Number(d.value) * 3))
                }))
              : widget.items || [
                  { id: "c1", label: "Q1", value: "$38M", progress: 45 },
                  { id: "c2", label: "Q2", value: "$51M", progress: 60 },
                  { id: "c3", label: "Q3", value: "$68M", progress: 80 },
                  { id: "c4", label: "Q4", value: "$84M", progress: 100 }
                ]
            ).map((bar) => (
              <div
                key={bar.id}
                className="flex flex-col items-center justify-end h-full gap-1"
              >
                <span className="text-[10px] font-bold">{bar.value}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(18, bar.progress || 55)}%`,
                    background: `linear-gradient(180deg, ${accentColor} 0%, rgba(99,102,241,0.4) 100%)`
                  }}
                />
                <span className={`text-[10px] ${mutedText}`}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(widget.type === "comparison-table" ||
        widget.type === "table" ||
        widget.type === "comparison") && (
        <div className="space-y-3 overflow-x-auto">
          {widget.title && (
            <div className="text-sm font-bold">{widget.title}</div>
          )}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {(
                  widget.columns ||
                  widget.tableHeaders || ["Capability", "Chronicle", "Legacy"]
                ).map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className={`py-2 px-3 font-semibold ${
                      cIdx === 1
                        ? "text-violet-300 bg-violet-500/10 rounded-t-lg"
                        : mutedText
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {(
                widget.rows ||
                widget.tableRows || [
                  ["Setup Speed", "< 30 seconds", "4+ hours"],
                  ["Smart Widgets", "34+ Interactive Blocks", "Static Shapes"]
                ]
              ).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2 px-3 ${
                        cIdx === 1
                          ? "font-semibold text-emerald-300 bg-violet-500/5"
                          : ""
                      }`}
                    >
                      {readOnly ? (
                        cell
                      ) : (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const sourceRows =
                              widget.rows || widget.tableRows || [];
                            const nextRows = sourceRows.map((r) => [...r]);
                            if (nextRows[rIdx]) {
                              nextRows[rIdx][cIdx] = e.target.value;
                              updateField({
                                rows: nextRows,
                                tableRows: nextRows
                              });
                            }
                          }}
                          className="w-full bg-transparent focus:outline-none"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(widget.type === "timeline" ||
        widget.type === "roadmap" ||
        widget.type === "steps" ||
        widget.type === "process" ||
        widget.type === "process-steps" ||
        widget.type === "gantt") && (
        <div className="space-y-3">
          {widget.title && (
            <div className="text-sm font-bold">{widget.title}</div>
          )}
          <div className="grid md:grid-cols-3 gap-3">
            {(
              widget.items || [
                {
                  id: "t1",
                  label: "Phase 1 • Q1",
                  value: "Foundation",
                  description: "Core architecture & design partners"
                },
                {
                  id: "t2",
                  label: "Phase 2 • Q2",
                  value: "Enterprise Scale",
                  description: "Automated brand governance & SOC2"
                },
                {
                  id: "t3",
                  label: "Phase 3 • Q3",
                  value: "Global API & MCP",
                  description: "Self-serve agent orchestration"
                }
              ]
            ).map((step, sIdx) => (
              <div
                key={step.id || sIdx}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  {step.label}
                </div>
                <div className="text-xs font-bold">{step.value}</div>
                <div className={`text-[11px] ${mutedText}`}>
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(widget.type === "bullet-list" || widget.type === "numbered-list") && (
        <div className="space-y-2.5">
          {widget.title && (
            <div className="text-sm font-bold">{widget.title}</div>
          )}
          <ul className="space-y-2 text-xs">
            {(
              widget.items || [
                { id: "b1", label: "Key strategic driver #1", description: "Backed by enterprise telemetry" },
                { id: "b2", label: "Key strategic driver #2", description: "146% net dollar retention" }
              ]
            ).map((item, idx) => (
              <li key={item.id || idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {widget.type === "numbered-list" ? idx + 1 : "•"}
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{item.label}</div>
                  {item.description && (
                    <div className={`text-[11px] ${mutedText}`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(widget.type === "image" ||
        widget.type === "gif" ||
        widget.type === "mosaic") && (
        <div className="space-y-2">
          <div className="h-44 rounded-xl overflow-hidden bg-black/40 border border-white/10 relative">
            <img
              src={
                widget.mediaUrl ||
                "https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/defaults/image-5.jpg"
              }
              alt={widget.title || "Slide visual"}
              className="w-full h-full object-cover"
            />
          </div>
          {widget.title && (
            <div className="text-xs font-semibold">{widget.title}</div>
          )}
        </div>
      )}

      {(widget.type === "video" ||
        widget.type === "youtube" ||
        widget.type === "loom" ||
        widget.type === "figma" ||
        widget.type === "embed") && (
        <div className="space-y-2">
          <div className="h-40 rounded-xl bg-gradient-to-br from-violet-950/60 to-indigo-950/60 border border-white/15 flex flex-col items-center justify-center p-4 text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div className="text-xs font-bold">
              {widget.title || `Interactive ${widget.type.toUpperCase()} Embed`}
            </div>
            <div className="text-[11px] text-zinc-400">
              {widget.mediaUrl || "https://chroniclehq.com/embed/live-demo"}
            </div>
          </div>
        </div>
      )}

      {widget.type === "quote" && (
        <div className="space-y-3">
          <Quote className="w-6 h-6 text-violet-400 opacity-75" />
          {readOnly ? (
            <blockquote className="text-base italic font-medium leading-relaxed">
              &ldquo;{widget.content || widget.title}&rdquo;
            </blockquote>
          ) : (
            <textarea
              rows={2}
              value={widget.content || widget.title || ""}
              onChange={(e) => updateField({ content: e.target.value })}
              className="w-full bg-transparent text-base italic font-medium focus:outline-none resize-none"
            />
          )}
          {widget.subtitle && (
            <div className={`text-xs font-semibold ${mutedText}`}>
              — {widget.subtitle}
            </div>
          )}
        </div>
      )}

      {(widget.type === "pros-cons" ||
        widget.type === "before-after" ||
        widget.type === "swot") && (
        <div className="space-y-2">
          <div className="text-sm font-bold">
            {widget.title || "Strategic Tradeoff Analysis"}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chronicle Advantage
              </div>
              <p className="text-zinc-300 text-[11px]">
                {widget.content || "Automated smart grid + instant Brand Kit tokens"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <div className="font-semibold text-rose-300 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Legacy Workflow
              </div>
              <p className="text-zinc-300 text-[11px]">
                {widget.subtitle || "Manual box alignment and inconsistent fonts"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Default Fallback for Box, Callout, Person Card, Icon Card, Paragraph, etc. */}
      {![
        "heading",
        "metric",
        "StatBox",
        "fact",
        "numbers",
        "progress-ring",
        "chart",
        "chart-bar",
        "chart-line",
        "funnel",
        "pyramid",
        "comparison-table",
        "table",
        "comparison",
        "timeline",
        "roadmap",
        "steps",
        "process",
        "process-steps",
        "gantt",
        "bullet-list",
        "numbered-list",
        "image",
        "gif",
        "mosaic",
        "video",
        "youtube",
        "loom",
        "figma",
        "embed",
        "quote",
        "pros-cons",
        "before-after",
        "swot"
      ].includes(widget.type) && (
        <div className="space-y-2">
          {readOnly ? (
            <h4
              className={`text-base font-bold ${
                widget.style?.italic ? "italic" : ""
              }`}
            >
              {widget.title}
            </h4>
          ) : (
            <input
              type="text"
              value={widget.title || ""}
              onChange={(e) => updateField({ title: e.target.value })}
              placeholder="Card title..."
              className={`w-full bg-transparent text-base font-bold focus:outline-none ${
                widget.style?.italic ? "italic" : ""
              }`}
            />
          )}

          {widget.subtitle && (
            <div className="text-xs font-medium text-violet-300">
              {widget.subtitle}
            </div>
          )}

          {readOnly ? (
            <p className={`text-xs leading-relaxed ${mutedText}`}>
              {widget.content}
            </p>
          ) : (
            <textarea
              rows={2}
              value={widget.content || ""}
              onChange={(e) => updateField({ content: e.target.value })}
              placeholder="Add key insight or supporting detail..."
              className={`w-full bg-transparent text-xs leading-relaxed ${mutedText} focus:outline-none resize-none`}
            />
          )}

          {widget.items && widget.items.length > 0 && (
            <div className="pt-2 space-y-1.5 border-t border-white/10">
              {widget.items.map((it, idx) => (
                <div
                  key={it.id || idx}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className={mutedText}>{it.label}</span>
                  <span className="font-semibold">{it.value || it.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
