import React from 'react'
import { View, Text, Textarea } from '@tarojs/components'

/**
 * 和纸胶带装饰
 */
export function WashiTape({
  color = '#F2C4C4',
  width = 200,
  rotation = 0,
  pattern = 'dots',
  className = '',
  style,
}: {
  color?: string
  width?: number
  rotation?: number
  pattern?: 'dots' | 'stripes' | 'solid'
  className?: string
  style?: React.CSSProperties
}) {
  const patternBg: Record<string, string> = {
    dots: 'radial-gradient(circle, rgba(255,255,255,0.45) 3px, transparent 3px)',
    stripes: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.3) 12px, rgba(255,255,255,0.3) 18px)',
    solid: 'none',
  }

  return (
    <View
      className={className}
      style={{
        position: 'absolute',
        zIndex: 10,
        width: `${width}px`,
        height: '44rpx',
        backgroundColor: color,
        backgroundImage: patternBg[pattern],
        backgroundSize: pattern === 'dots' ? '20px 20px' : undefined,
        opacity: 0.82,
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        ...style,
      }}
    />
  )
}

/**
 * 便利贴卡片
 */
export function StickyNote({
  children,
  color = '#FFF3A3',
  rotation = 1,
  className = '',
  style,
  shadow = true,
}: {
  children: React.ReactNode
  color?: string
  rotation?: number
  className?: string
  style?: React.CSSProperties
  shadow?: boolean
}) {
  return (
    <View
      className={className}
      style={{
        position: 'relative',
        padding: '24px',
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
        boxShadow: shadow
          ? '4px 8px 20px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)'
          : undefined,
        ...style,
      }}
    >
      {/* 顶部折叠阴影 */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.07) 0%, transparent 100%)',
        }}
      />
      {children}
    </View>
  )
}

/**
 * 纸张横线背景
 */
export function PaperRuledLines({
  lineHeight = 32,
  offset = 8,
}: {
  lineHeight?: number
  offset?: number
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${lineHeight - 1}px,
          var(--paper-line) ${lineHeight - 1}px,
          var(--paper-line) ${lineHeight}px
        )`,
        backgroundPosition: `0 ${offset}px`,
      }}
    />
  )
}

/**
 * 笔记本边距线
 */
export function NotebookMarginLine({ left = 88 }: { left?: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        left: `${left}px`,
        width: '2px',
        background: 'var(--paper-margin)',
      }}
    />
  )
}

/**
 * SVG 进度圆环
 */
export function ProgressRing({
  progress,
  size = 160,
  strokeWidth = 12,
  color = '#8B5E3C',
  trackColor = '#E8DFD0',
  children,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <View
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* 使用 View 模拟圆环 - 小程序中 SVG 支持有限，用 border 方式实现 */}
      <View
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          border: `${strokeWidth}px solid ${trackColor}`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* 进度弧 - 用旋转的半圆实现 */}
      <View
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          border: `${strokeWidth}px solid transparent`,
          borderTopColor: progress > 0 ? color : 'transparent',
          borderRightColor: progress > 25 ? color : 'transparent',
          borderBottomColor: progress > 50 ? color : 'transparent',
          borderLeftColor: progress > 75 ? color : 'transparent',
          transform: `rotate(${-90 + (progress / 100) * 360}deg)`,
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.3s ease',
        }}
      />
      {/* 中心内容 */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  )
}

/**
 * 中文手写体文字
 */
export function ChineseHandwritten({
  children,
  className = '',
  size = 'base',
  color,
  style,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: string
  style?: React.CSSProperties
}) {
  const sizes: Record<string, string> = {
    sm: '24px',
    base: '30px',
    lg: '36px',
    xl: '42px',
    '2xl': '52px',
  }
  return (
    <Text
      className={className}
      style={{
        fontFamily: "'STKaiti', 'KaiTi', 'Noto Serif SC', serif",
        fontSize: sizes[size],
        color: color || 'var(--foreground)',
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </Text>
  )
}

/**
 * 英文手写体文字
 */
export function HandwrittenLabel({
  children,
  className = '',
  size = 'base',
  color,
  style,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: string
  style?: React.CSSProperties
}) {
  const sizes: Record<string, string> = {
    sm: '26px',
    base: '32px',
    lg: '38px',
    xl: '44px',
    '2xl': '52px',
  }
  return (
    <Text
      className={className}
      style={{
        fontFamily: "'Segoe Script', 'Comic Sans MS', cursive",
        fontSize: sizes[size],
        color: color || 'var(--foreground)',
        lineHeight: 1.3,
        ...style,
      }}
    >
      {children}
    </Text>
  )
}

/**
 * 螺旋装订装饰
 */
export function SpiralBinding() {
  const rings = Array.from({ length: 18 })
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {rings.map((_, i) => (
        <View
          key={i}
          style={{
            width: '20px',
            height: '16px',
            borderRadius: '50%',
            border: '4px solid var(--primary)',
            opacity: 0.45,
            background: 'transparent',
          }}
        />
      ))}
    </View>
  )
}

/**
 * 铅笔分隔线
 */
export function PencilDivider({ label }: { label?: string }) {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        marginBottom: '12px',
      }}
    >
      <View
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--paper-line)',
          borderTop: '2px dashed var(--paper-margin)',
        }}
      />
      {label && (
        <Text
          style={{
            paddingLeft: '8px',
            paddingRight: '8px',
            fontSize: '24px',
            fontFamily: "'Segoe Script', cursive",
            color: 'var(--muted-foreground)',
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flex: 1,
          height: '1px',
          borderTop: '2px dashed var(--paper-margin)',
        }}
      />
    </View>
  )
}

/**
 * 表情评分组件
 */
export function EmojiRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const emojis = ['😞', '😕', '😐', '😊', '😄']
  return (
    <View style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      {emojis.map((emoji, i) => {
        const isActive = value === i + 1
        return (
          <View
            key={i}
            onClick={() => onChange(i + 1)}
            style={{
              fontSize: isActive ? '56px' : '44px',
              transform: isActive ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
              filter: isActive ? 'none' : 'grayscale(0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <Text>{emoji}</Text>
          </View>
        )
      })}
    </View>
  )
}

/**
 * 标签芯片
 */
export function TagChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  color?: string
}) {
  return (
    <View
      onClick={onClick}
      style={{
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '9999px',
        border: `2px solid ${active ? (color || 'var(--primary)') : 'var(--border)'}`,
        fontFamily: "'STKaiti', 'KaiTi', serif",
        fontSize: '26px',
        backgroundColor: active ? (color || 'var(--primary)') : 'transparent',
        color: active ? 'var(--primary-foreground)' : 'var(--foreground)',
        transform: active ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.15s ease',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
        display: 'inline-block',
      }}
    >
      {label}
    </View>
  )
}

/**
 * 仿纸张横线 Textarea（小程序使用原生 Textarea）
 */
export function PaperTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  style,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Textarea
      value={value}
      onInput={(e) => onChange(e.detail.value)}
      placeholder={placeholder}
      placeholderStyle={`color: var(--muted-foreground); font-family: 'Segoe Script', cursive; font-size: 28px;`}
      className={className}
      style={{
        width: '100%',
        minHeight: `${rows * 64}px`,
        outline: 'none',
        background: 'transparent',
        fontFamily: "'Segoe Script', cursive",
        fontSize: '32px',
        color: 'var(--foreground)',
        lineHeight: '64px',
        border: 'none',
        ...style,
      }}
    />
  )
}
