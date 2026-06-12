import React, { useState } from 'react'
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

interface RecentEntry {
  id: number
  date: string
  weekday: string
  meals: number
  note: string
  duration: string
  color: string
  rotation: number
  // 详细数据
  photoTaken: boolean
  foodDesc: string
  startTime: string
  endTime: string
  chewFreq: number
  location: string
  companions: string[]
  mealScenes: string[]
  media: string[]
  satisfaction: number
  moodBefore: number
  notes: string
}

const recentEntries: RecentEntry[] = [
  {
    id: 1,
    date: '6月4日',
    weekday: '周三',
    meals: 3,
    note: '午饭吃得很慢，心情不错',
    duration: '28分钟',
    color: '#FFF3A3',
    rotation: -1,
    photoTaken: true,
    foodDesc: '三文鱼沙拉、糙米饭、味噌汤',
    startTime: '12:05',
    endTime: '12:33',
    chewFreq: 20,
    location: '餐厅',
    companions: ['朋友'],
    mealScenes: ['聚餐', '日常家庭用餐'],
    media: ['无'],
    satisfaction: 4,
    moodBefore: 3,
    notes: '和朋友聊了很多，吃得很愉快',
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
    photoTaken: false,
    foodDesc: '外卖盖浇饭',
    startTime: '12:30',
    endTime: '12:42',
    chewFreq: 10,
    location: '办公室',
    companions: ['独自'],
    mealScenes: ['工作/课程间隙'],
    media: ['手机'],
    satisfaction: 2,
    moodBefore: 2,
    notes: '太赶了，没好好品味',
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
    photoTaken: true,
    foodDesc: '意大利面、凯撒沙拉、提拉米苏',
    startTime: '18:30',
    endTime: '19:05',
    chewFreq: 15,
    location: '餐厅',
    companions: ['朋友', '同事'],
    mealScenes: ['聚餐', '吃漂亮饭'],
    media: ['手机'],
    satisfaction: 5,
    moodBefore: 4,
    notes: '环境很好，食物也很棒',
  },
]

export default function HomePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const getDateString = () => {
    const now = new Date()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${weekdays[now.getDay()]}`
  }

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
              用餐日记
            </ChineseHandwritten>
            <HandwrittenLabel size="base" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
              Eating Diary
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
          <PaperRuledLines lineHeight={45} />
          <NotebookMarginLine left={40} />

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
            {getDateString()}
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
          {recentEntries.map((entry, idx) => {
            const isExpanded = expandedId === entry.id
            const handleToggle = (e: any) => {
              e.stopPropagation()
              setExpandedId(isExpanded ? null : entry.id)
            }
            return (
              <View key={entry.id} style={{ marginLeft: idx % 2 === 1 ? '12px' : '0px' }}>
                {/* Clickable summary card - has explicit width for tappable area */}
                <View
                  onClick={handleToggle}
                  hoverClass="none"
                  style={{ width: '100%', position: 'relative' }}
                >
                  <StickyNote color={entry.color} rotation={entry.rotation} className="rounded-lg">
                    <View style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
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
                    {/* Expand indicator */}
                    <View style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                      <Text style={{ fontSize: '16px', color: 'var(--muted-foreground)' }}>
                        {isExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </StickyNote>
                </View>

                {/* Expanded detail card */}
                {isExpanded && (
                  <View
                    onClick={(e: any) => e.stopPropagation()}
                    hoverClass="none"
                    style={{
                      marginTop: '-8px',
                      marginLeft: '8px',
                      marginRight: '8px',
                      borderRadius: '14px',
                      padding: '18px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 6px 24px rgba(139,94,60,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                      zIndex: 5,
                    }}
                  >
                    <PaperRuledLines lineHeight={44} />
                    <NotebookMarginLine left={40} />

                    <View style={{ paddingLeft: '48px', position: 'relative', zIndex: 10 }}>
                      {/* Date & meals */}
                      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <View>
                          <ChineseHandwritten size="base" color="var(--primary)">
                            {entry.date} · {entry.weekday}
                          </ChineseHandwritten>
                          <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '2px' }}>
                            共 {entry.meals} 餐记录
                          </HandwrittenLabel>
                        </View>
                        <Text style={{ fontSize: '24px' }}>{entry.photoTaken ? '📸' : '📝'}</Text>
                      </View>

                      {/* Photo area */}
                      <View
                        style={{
                          width: '100%',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          marginBottom: '14px',
                          border: entry.photoTaken ? '2px solid var(--secondary)' : '2px dashed var(--border)',
                          background: entry.photoTaken ? 'var(--muted)' : 'var(--card)',
                          aspectRatio: '4/3',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {entry.photoTaken ? (
                          <>
                            <Text style={{ fontSize: '40px' }}>🥗</Text>
                            <ChineseHandwritten size="sm" color="var(--secondary)">
                              已拍照记录
                            </ChineseHandwritten>
                          </>
                        ) : (
                          <>
                            <Text style={{ fontSize: '32px' }}>📷</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              未拍照
                            </ChineseHandwritten>
                          </>
                        )}
                      </View>

                      {/* Food description */}
                      <View style={{ marginBottom: '14px' }}>
                        <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Text style={{ fontSize: '16px' }}>✏️</Text>
                          <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                            食物描述
                          </ChineseHandwritten>
                        </View>
                        <ChineseHandwritten size="base" color="var(--foreground)" style={{ display: 'block', paddingLeft: '0px' }}>
                          {entry.foodDesc}
                        </ChineseHandwritten>
                      </View>

                      {/* Time & Duration */}
                      <View
                        style={{
                          marginBottom: '14px',
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'var(--muted)',
                        }}
                      >
                        <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <Text style={{ fontSize: '16px' }}>⏱️</Text>
                          <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                            进食时间
                          </ChineseHandwritten>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <HandwrittenLabel size="base" color="var(--foreground)">
                            {entry.startTime}
                          </HandwrittenLabel>
                          <Text style={{ color: 'var(--muted-foreground)' }}>→</Text>
                          <HandwrittenLabel size="base" color="var(--foreground)">
                            {entry.endTime}
                          </HandwrittenLabel>
                          <Text style={{ color: 'var(--muted-foreground)', marginLeft: '8px' }}>
                            · {entry.duration}
                          </Text>
                        </View>
                      </View>

                      {/* Chewing frequency */}
                      <View
                        style={{
                          marginBottom: '14px',
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'var(--muted)',
                        }}
                      >
                        <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Text style={{ fontSize: '16px' }}>🦷</Text>
                          <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                            咀嚼频率
                          </ChineseHandwritten>
                        </View>
                        <HandwrittenLabel size="xl" color="var(--primary)">
                          {entry.chewFreq} 次/口
                        </HandwrittenLabel>
                      </View>

                      {/* Tags row: location */}
                      {entry.location && (
                        <View style={{ marginBottom: '10px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '16px' }}>📍</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              地点 & 陪伴
                            </ChineseHandwritten>
                          </View>
                          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            <View
                              style={{
                                paddingLeft: '14px',
                                paddingRight: '14px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                borderRadius: '9999px',
                                border: '2px solid var(--primary)',
                                background: 'var(--primary)',
                                display: 'inline-block',
                              }}
                            >
                              <ChineseHandwritten size="sm" color="var(--primary-foreground)">
                                {entry.location}
                              </ChineseHandwritten>
                            </View>
                            {entry.companions.map((c) => (
                              <View
                                key={c}
                                style={{
                                  paddingLeft: '14px',
                                  paddingRight: '14px',
                                  paddingTop: '4px',
                                  paddingBottom: '4px',
                                  borderRadius: '9999px',
                                  border: '2px solid var(--border)',
                                  background: 'var(--card)',
                                  display: 'inline-block',
                                }}
                              >
                                <ChineseHandwritten size="sm" color="var(--foreground)">
                                  {c}
                                </ChineseHandwritten>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Meal scenes */}
                      {entry.mealScenes.length > 0 && (
                        <View style={{ marginBottom: '10px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '16px' }}>🍽️</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              用餐场景
                            </ChineseHandwritten>
                          </View>
                          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {entry.mealScenes.map((s) => (
                              <View
                                key={s}
                                style={{
                                  paddingLeft: '14px',
                                  paddingRight: '14px',
                                  paddingTop: '4px',
                                  paddingBottom: '4px',
                                  borderRadius: '9999px',
                                  border: '2px solid var(--secondary)',
                                  background: 'var(--secondary)',
                                  display: 'inline-block',
                                }}
                              >
                                <ChineseHandwritten size="sm" color="var(--secondary-foreground)">
                                  {s}
                                </ChineseHandwritten>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Media usage */}
                      {entry.media.length > 0 && (
                        <View style={{ marginBottom: '10px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '16px' }}>📱</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              媒体使用
                            </ChineseHandwritten>
                          </View>
                          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {entry.media.map((m) => (
                              <View
                                key={m}
                                style={{
                                  paddingLeft: '14px',
                                  paddingRight: '14px',
                                  paddingTop: '4px',
                                  paddingBottom: '4px',
                                  borderRadius: '9999px',
                                  border: '2px solid var(--accent)',
                                  background: m === '无' ? 'var(--muted)' : 'var(--accent)',
                                  display: 'inline-block',
                                }}
                              >
                                <ChineseHandwritten
                                  size="sm"
                                  color={m === '无' ? 'var(--muted-foreground)' : 'var(--accent-foreground)'}
                                >
                                  {m}
                                </ChineseHandwritten>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Satisfaction & Mood side by side */}
                      <View style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                        <View
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'var(--muted)',
                            textAlign: 'center',
                          }}
                        >
                          <Text style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>🌱 餐前心情</Text>
                          <View style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Text
                                key={n}
                                style={{
                                  fontSize: n <= entry.moodBefore ? '24px' : '20px',
                                  filter: n <= entry.moodBefore ? 'none' : 'grayscale(0.5)',
                                  opacity: n <= entry.moodBefore ? 1 : 0.4,
                                }}
                              >
                                {['😞', '😕', '😐', '😊', '😄'][n - 1]}
                              </Text>
                            ))}
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'var(--muted)',
                            textAlign: 'center',
                          }}
                        >
                          <Text style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>✨ 餐后满足</Text>
                          <View style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Text
                                key={n}
                                style={{
                                  fontSize: n <= entry.satisfaction ? '24px' : '20px',
                                  filter: n <= entry.satisfaction ? 'none' : 'grayscale(0.5)',
                                  opacity: n <= entry.satisfaction ? 1 : 0.4,
                                }}
                              >
                                {['😞', '😕', '😐', '😊', '😄'][n - 1]}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </View>

                      {/* Notes */}
                      {entry.notes && (
                        <View style={{ marginBottom: '4px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <Text style={{ fontSize: '16px' }}>📝</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              备注
                            </ChineseHandwritten>
                          </View>
                          <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block' }}>
                            {entry.notes}
                          </ChineseHandwritten>
                        </View>
                      )}
                    </View>

                    {/* Tape decoration */}
                    <WashiTape
                      color={entry.color}
                      width={80}
                      rotation={-2}
                      pattern="stripes"
                      style={{ top: '4px', right: '12px' }}
                    />
                  </View>
                )}
              </View>
            )
          })}
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
              <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                请确保您记录的是正餐，并在餐后30分钟内完成记录。
              </ChineseHandwritten>
            </View>
          </View>
        </StickyNote>
      </View>
    </View>
  )
}
