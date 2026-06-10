import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  WashiTape,
  StickyNote,
  ProgressRing,
  ChineseHandwritten,
  HandwrittenLabel,
  PaperRuledLines,
  NotebookMarginLine,
} from '../../components/SharedElements'

const STUDY_TOTAL_DAYS = 5
const CURRENT_DAY = 3
const progress = (CURRENT_DAY / STUDY_TOTAL_DAYS) * 100

const recentEntries = [
  {
    id: 1,
    date: '6月4日',
    weekday: '周三',
    meals: 3,
    note: '午饭吃得很慢，心情不错',
    duration: '28分钟',
    color: '#FFF3A3',
    rotation: -1,
  },
  {
    id: 2,
    date: '6月3日',
    weekday: '周二',
    meals: 2,
    note: '边看手机边吃，没注意咀嚼',
    duration: '12分钟',
    color: '#FFD6D6',
    rotation: 1.5,
  },
  {
    id: 3,
    date: '6月2日',
    weekday: '周一',
    meals: 3,
    note: '和朋友一起吃饭，聊天很愉快',
    duration: '35分钟',
    color: '#D6F0D6',
    rotation: -0.5,
  },
]

export default function HomePage() {
  const handleStartEntry = () => {
    Taro.switchTab({ url: '/pages/entry/index' })
  }

  return (
    <View style={{ flex: 1, overflowY: 'auto', position: 'relative', background: 'var(--background)' }}>
      {/* Header washi tape accent */}
      <WashiTape
        color="#F2C4C4"
        width={160}
        rotation={-1.5}
        pattern="dots"
        style={{ top: '12px', left: '16px' }}
      />
      <WashiTape
        color="#C4D9C4"
        width={100}
        rotation={1}
        pattern="stripes"
        style={{ top: '12px', right: '24px' }}
      />

      {/* Header */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px', paddingBottom: '16px', position: 'relative' }}>
        <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <ChineseHandwritten size="2xl" style={{ display: 'block', lineHeight: 1.25 }} color="var(--primary)">
              正念饮食日记
            </ChineseHandwritten>
            <HandwrittenLabel size="base" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
              Mindful Eating Diary
            </HandwrittenLabel>
          </View>
          <View
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--muted)',
              border: '2px dashed var(--border)',
            }}
          >
            <Text style={{ fontSize: '22px' }}>🌿</Text>
          </View>
        </View>

        {/* Study progress card */}
        <View
          style={{
            marginTop: '20px',
            borderRadius: '16px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card)',
            boxShadow: '0 4px 16px rgba(139, 94, 60, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
            border: '1px solid var(--border)',
          }}
        >
          <PaperRuledLines lineHeight={28} />
          <NotebookMarginLine />

          <View style={{ paddingLeft: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
            <View>
              <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
                研究进度
              </ChineseHandwritten>
              <View style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                <HandwrittenLabel size="xl" color="var(--primary)">
                  第 {CURRENT_DAY} 天
                </HandwrittenLabel>
                <HandwrittenLabel size="sm" color="var(--muted-foreground)">
                  / {STUDY_TOTAL_DAYS}天
                </HandwrittenLabel>
              </View>
              <ChineseHandwritten size="sm" color="var(--secondary)" style={{ display: 'block', marginTop: '4px' }}>
                还有 {STUDY_TOTAL_DAYS - CURRENT_DAY} 天完成研究 ✨
              </ChineseHandwritten>
            </View>

            <ProgressRing
              progress={progress}
              size={82}
              strokeWidth={8}
              color="var(--primary)"
              trackColor="var(--muted)"
              style={{ marginRight: '-1px', marginTop: '-4px' }}
            >
              <View style={{ textAlign: 'center' }}>
                <HandwrittenLabel size="lg" color="var(--primary)">
                  {Math.round(progress)}%
                </HandwrittenLabel>
              </View>
            </ProgressRing>
          </View>

          {/* Progress dots row */}
          <View style={{ paddingLeft: '48px', marginTop: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            {Array.from({ length: STUDY_TOTAL_DAYS }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: i < CURRENT_DAY ? 'var(--primary)' : 'var(--muted)',
                  boxShadow: i < CURRENT_DAY ? '0 2px 4px rgba(139,94,60,0.3)' : 'none',
                }}
              >
                {i < CURRENT_DAY && (
                  <Text style={{ fontSize: '10px', color: 'var(--primary-foreground)' }}>✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Today's status */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '8px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px', color: 'var(--accent)' }}>✏️</Text>
          <ChineseHandwritten size="base" color="var(--foreground)">
            今日记录
          </ChineseHandwritten>
          <Text
            style={{
              marginLeft: 'auto',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
              fontSize: '12px',
              background: 'var(--muted)',
              fontFamily: "'Segoe Script', cursive",
              color: 'var(--muted-foreground)',
            }}
          >
            2026年6月5日 · 周五
          </Text>
        </View>

        {/* Today's entry status - not yet done */}
        <View
          style={{
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card)',
            border: '2px dashed var(--border)',
          }}
        >
          <View style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <View
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--muted)',
              }}
            >
              <Text style={{ fontSize: '22px' }}>📒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <ChineseHandwritten size="base" style={{ display: 'block' }} color="var(--foreground)">
                今天还没有用餐记录
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
                Tap below to log your first meal today
              </HandwrittenLabel>
            </View>
          </View>

          {/* Stats row */}
          <View
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              display: 'flex',
              gap: '16px',
              borderTop: '1px dashed var(--border)',
            }}
          >
            {[
              { icon: '🍽️', label: '用餐次数', value: '0 / 3' },
              { icon: '⏱️', label: '平均时长', value: '-- 分钟' },
              { icon: '😊', label: '平均满足', value: '--' },
            ].map((stat) => (
              <View key={stat.label} style={{ flex: 1, textAlign: 'center' }}>
                <Text style={{ fontSize: '18px' }}>{stat.icon}</Text>
                <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
                  {stat.label}
                </ChineseHandwritten>
                <HandwrittenLabel size="base" color="var(--foreground)">
                  {stat.value}
                </HandwrittenLabel>
              </View>
            ))}
          </View>
        </View>

        {/* Start today's entry button */}
        <View
          onClick={handleStartEntry}
          style={{
            width: '100%',
            paddingTop: '16px',
            paddingBottom: '16px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--primary)',
            boxShadow: '0 6px 20px rgba(139, 94, 60, 0.35), 0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <WashiTape
            color="#F2DBA4"
            width={60}
            rotation={-3}
            pattern="dots"
            style={{ top: '4px', left: '16px' }}
          />
          <Text
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'STKaiti', 'KaiTi', serif",
              fontSize: '18px',
              color: 'var(--primary-foreground)',
            }}
          >
            📖 开始今日用餐记录
          </Text>
          <Text
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'block',
              marginTop: '2px',
              textAlign: 'center',
              fontFamily: "'Segoe Script', cursive",
              fontSize: '13px',
              color: 'rgba(251,247,238,0.7)',
            }}
          >
            Start Today's Entry
          </Text>
        </View>
      </View>

      {/* Recent entries section */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '6px', marginTop: '8px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px', color: 'var(--accent)' }}>🕐</Text>
          <ChineseHandwritten size="base" color="var(--foreground)">
            近期记录
          </ChineseHandwritten>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentEntries.map((entry, idx) => (
            <View key={entry.id} style={{ marginLeft: idx % 2 === 1 ? '12px' : '0px' }}>
              <StickyNote color={entry.color} rotation={entry.rotation} className="rounded-lg">
                <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View>
                    <ChineseHandwritten size="base" color="var(--foreground)" style={{ display: 'block' }}>
                      {entry.date} · {entry.weekday}
                    </ChineseHandwritten>
                    <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                      {entry.note}
                    </ChineseHandwritten>
                  </View>
                  <View style={{ textAlign: 'right', marginLeft: '12px' }}>
                    <View
                      style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '2px',
                        paddingBottom: '2px',
                        borderRadius: '9999px',
                        background: 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <HandwrittenLabel size="sm" color="var(--foreground)">
                        {entry.meals} 餐
                      </HandwrittenLabel>
                    </View>
                    <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                      均 {entry.duration}
                    </ChineseHandwritten>
                  </View>
                </View>
              </StickyNote>
            </View>
          ))}
        </View>
      </View>

      {/* Research note sticky */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>
        <StickyNote color="#D6E8FF" rotation={-0.8} className="rounded-lg">
          <View style={{ display: 'flex', gap: '8px' }}>
            <Text style={{ fontSize: '20px' }}>📌</Text>
            <View>
              <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block' }}>
                研究员备注
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                Please log meals within 30 min of finishing. Include drinks and snacks. Your data is confidential.
              </HandwrittenLabel>
            </View>
          </View>
        </StickyNote>
      </View>
    </View>
  )
}
