import React, { useState, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
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

// ===== 工具函数 =====

/** 获取今日日期字符串（与 entry 页保存格式一致） */
function getTodayDateStr(): string {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
}

/** 获取带星期几的日期字符串（仅用于显示） */
function getDateString(): string {
  const now = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · ${weekdays[now.getDay()]}`
}

/** 解析 "2026年6月25日" 格式为 Date */
function parseDateStr(dateStr: string): Date | null {
  const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/)
  if (!match) return null
  return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
}

/** 短格式 "6月25日" */
function formatDateShort(dateStr: string): string {
  const d = parseDateStr(dateStr)
  if (!d) return dateStr
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

/** 从日期字符串获取星期几 */
function getWeekday(dateStr: string): string {
  const d = parseDateStr(dateStr)
  if (!d) return ''
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[d.getDay()]
}

/** 数组平均值（取整） */
function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
}

/** 安全解析 duration（可能是 number 或 string '--'） */
function parseDuration(d: any): number {
  if (typeof d === 'number') return d
  if (typeof d === 'string') {
    const n = parseInt(d)
    return isNaN(n) ? 0 : n
  }
  return 0
}

// ===== 近期记录数据结构 =====
interface RecentEntry {
  id: number
  date: string
  weekday: string
  meals: number
  note: string
  duration: string
  color: string
  rotation: number
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
  allMeals: any[]  // 当天全部餐次记录，用于左右切换
}

const CARD_COLORS = ['#FFF3A3', '#FFD6D6', '#D6F0D6', '#D6E8FF', '#E8D6F0']
const CARD_ROTATIONS = [-1, 1.5, -0.5, 1, -1.2]

export default function HomePage() {
  const [allRecords, setAllRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  // 展开详情中当前查看的餐次索引（key: entry.id, value: 0-based index）
  const [expandedMealIndex, setExpandedMealIndex] = useState<Record<number, number>>({})

  /** 切换展开详情中的餐次 */
  const switchMeal = (entryId: number, direction: number) => {
    setExpandedMealIndex((prev) => {
      const entry = recentEntries.find((e) => e.id === entryId)
      const total = entry?.allMeals?.length || 1
      const current = prev[entryId] || 0
      const next = Math.max(0, Math.min(total - 1, current + direction))
      if (next === current) return prev
      return { ...prev, [entryId]: next }
    })
  }

  // 从云数据库拉取所有记录
  const fetchRecords = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      if (Taro.cloud) {
        const res = await Taro.cloud.callFunction({ name: 'getRecords' })
        const result = res.result as any
        if (result?.success) {
          setAllRecords(result.records || [])
        } else {
          console.warn('getRecords 返回失败:', result?.error)
          setLoadError(result?.error || '查询失败')
          setAllRecords([])
        }
      } else {
        console.log('[本地] 云开发不可用，显示空数据')
        setAllRecords([])
      }
    } catch (err: any) {
      const errMsg = err?.errMsg || err?.message || String(err)
      console.error('获取记录失败:', errMsg)
      // 超时特殊处理
      if (errMsg.includes('timeout')) {
        setLoadError('云函数超时，请确认 getRecords 已部署')
        Taro.showToast({ title: '加载超时，请检查云函数是否已部署', icon: 'none', duration: 2500 })
      } else {
        setLoadError(errMsg)
        Taro.showToast({ title: '加载失败，下拉刷新重试', icon: 'none', duration: 2000 })
      }
      setAllRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  // 页面显示时刷新（从 entry 页返回时自动更新）
  useDidShow(() => {
    fetchRecords()
  })

  // ===== 数据处理：按日期分组 =====
  const groupedByDate = new Map<string, any[]>()
  allRecords.forEach((r) => {
    const date = r.date || ''
    if (!groupedByDate.has(date)) groupedByDate.set(date, [])
    groupedByDate.get(date)!.push(r)
  })

  const todayStr = getTodayDateStr()
  const todayRecords = groupedByDate.get(todayStr) || []
  const hasTodayRecords = todayRecords.length > 0

  // 今日统计
  const todayMealCount = todayRecords.length
  const todayDurations = todayRecords.map((r) => parseDuration(r.duration)).filter((d) => d > 0)
  const todayAvgDuration = todayDurations.length > 0 ? Math.round(todayDurations.reduce((a, b) => a + b, 0) / todayDurations.length) : 0
  const todaySatisfactions = todayRecords.map((r) => r.satisfaction || 0).filter((s) => s > 0)
  const todayAvgSatisfaction = todaySatisfactions.length > 0
    ? (todaySatisfactions.reduce((a, b) => a + b, 0) / todaySatisfactions.length).toFixed(1)
    : ''

  // 研究进度
  const recordedDays = groupedByDate.size
  const currentDay = Math.min(recordedDays, STUDY_TOTAL_DAYS)
  const progress = Math.round((currentDay / STUDY_TOTAL_DAYS) * 100)

  // 近期记录：包含今天，按日期降序，取最近 STUDY_TOTAL_DAYS 天
  const recentDates = Array.from(groupedByDate.keys())
    .sort((a, b) => b.localeCompare(a))
    .slice(0, STUDY_TOTAL_DAYS)

  const recentEntries: RecentEntry[] = recentDates.map((date, idx) => {
    // 按 mealNumber 升序排列，保证切换顺序符合餐次编号
    const records = [...(groupedByDate.get(date)!)]
      .sort((a, b) => (a.mealNumber || 0) - (b.mealNumber || 0))
    const firstRecord = records[0] || {}
    const durations = records.map((r) => parseDuration(r.duration)).filter((d) => d > 0)
    const avgDur = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0

    return {
      id: idx + 1,
      date: formatDateShort(date),
      weekday: getWeekday(date),
      meals: records.length,
      // 每日一句总结：DB 中无专门字段，从餐次备注/食物描述拼合，加【】标明
      note: firstRecord.notes
        ? `【备注】${firstRecord.notes}`
        : firstRecord.foodDesc
          ? `【食物】${firstRecord.foodDesc}`
          : '【暂无记录详情】',
      duration: avgDur > 0 ? `${avgDur}分钟` : '--分钟',
      color: CARD_COLORS[idx % CARD_COLORS.length],
      rotation: CARD_ROTATIONS[idx % CARD_ROTATIONS.length],
      photoTaken: firstRecord.photoTaken || false,
      foodDesc: firstRecord.foodDesc || '',
      startTime: firstRecord.startTime || '',
      endTime: firstRecord.endTime || '',
      chewFreq: firstRecord.chewFreq || 0,
      location: firstRecord.location || '',
      companions: firstRecord.companions || [],
      mealScenes: firstRecord.mealScenes || [],
      media: firstRecord.media || [],
      satisfaction: firstRecord.satisfaction || 0,
      moodBefore: firstRecord.moodBefore || 0,
      notes: firstRecord.notes || '',
      allMeals: records,
    }
  })

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
                  第 {currentDay} 天
                </HandwrittenLabel>
                <HandwrittenLabel size="sm" color="var(--muted-foreground)">
                  / {STUDY_TOTAL_DAYS}天
                </HandwrittenLabel>
              </View>
              <ChineseHandwritten size="sm" color="var(--secondary)" style={{ display: 'block', marginTop: '4px' }}>
                {currentDay >= STUDY_TOTAL_DAYS ? '研究已完成 🎉' : `还有 ${STUDY_TOTAL_DAYS - currentDay} 天完成研究 ✨`}
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
                  background: i < currentDay ? 'var(--primary)' : 'var(--muted)',
                  boxShadow: i < currentDay ? '0 2px 4px rgba(139,94,60,0.3)' : 'none',
                }}
              >
                {i < currentDay && (
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

        {/* Today's entry status - dynamic */}
        <View
          style={{
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: hasTodayRecords ? 'var(--card)' : 'var(--card)',
            border: hasTodayRecords ? '2px solid var(--secondary)' : '2px dashed var(--border)',
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
                background: hasTodayRecords ? 'var(--secondary)' : 'var(--muted)',
              }}
            >
              <Text style={{ fontSize: '22px' }}>{hasTodayRecords ? '🍽️' : '📒'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <ChineseHandwritten size="base" style={{ display: 'block' }} color="var(--foreground)">
                {hasTodayRecords ? `今天已有 ${todayMealCount} 餐记录` : '今天还没有用餐记录'}
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
                {hasTodayRecords ? 'Keep it up! 点击下方继续记录' : 'Tap below to log your first meal today'}
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
              { icon: '🍽️', label: '用餐次数', value: `${todayMealCount} / 3` },
              { icon: '⏱️', label: '平均时长', value: todayAvgDuration > 0 ? `${todayAvgDuration} 分钟` : '-- 分钟' },
              { icon: '😊', label: '平均满足', value: todayAvgSatisfaction || '--' },
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
          {loading && allRecords.length === 0 ? (
            <View style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
              <Text style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>⏳</Text>
              <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                加载中...
              </ChineseHandwritten>
            </View>
          ) : loadError ? (
            <View
              style={{
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: '#FFF3F3',
                border: '1px dashed #E88B8B',
              }}
            >
              <Text style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⚠️</Text>
              <ChineseHandwritten size="sm" color="#B85450">
                数据加载失败
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="#C06060" style={{ display: 'block', marginTop: '4px' }}>
                {loadError.includes('timeout') ? '请部署 getRecords 云函数' : '请检查网络后重试'}
              </HandwrittenLabel>
            </View>
          ) : recentEntries.length === 0 ? (
            <View
              style={{
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: 'var(--card)',
                border: '1px dashed var(--border)',
              }}
            >
              <Text style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>
                {allRecords.length > 0 ? '📅' : '📝'}
              </Text>
              <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                {allRecords.length > 0 ? '今天已有记录 ✨' : '还没有历史记录'}
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                {allRecords.length > 0 ? '历史记录将在明天显示在这里' : '开始记录你的第一餐吧～'}
              </HandwrittenLabel>
            </View>
          ) : (
            recentEntries.map((entry, idx) => {
            const isExpanded = expandedId === entry.id
            const handleToggle = (e: any) => {
              e.stopPropagation()
              setExpandedId(isExpanded ? null : entry.id)
              // 展开时重置餐次索引
              if (!isExpanded) {
                setExpandedMealIndex((prev) => ({ ...prev, [entry.id]: 0 }))
              }
            }
            // 当前查看的餐次
            const mealIdx = expandedMealIndex[entry.id] || 0
            const currentMeal = entry.allMeals?.[mealIdx] || entry
            const hasMultipleMeals = entry.allMeals.length > 1
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
                        <Text style={{ fontSize: '24px' }}>{currentMeal.photoTaken ? '📸' : '📝'}</Text>
                      </View>

                      {/* 餐次切换导航 */}
                      {hasMultipleMeals && (
                        <View
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            marginBottom: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            borderRadius: '10px',
                            background: 'var(--muted)',
                          }}
                        >
                          <View
                            onClick={(e: any) => { e.stopPropagation(); switchMeal(entry.id, -1) }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: mealIdx > 0 ? 'var(--primary)' : 'var(--border)',
                              opacity: mealIdx > 0 ? 1 : 0.4,
                            }}
                          >
                            <Text style={{ fontSize: '16px', color: mealIdx > 0 ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}>←</Text>
                          </View>
                          <ChineseHandwritten size="sm" color="var(--foreground)">
                            第{currentMeal.mealNumber || mealIdx + 1}餐 / 共{entry.allMeals.length}餐
                          </ChineseHandwritten>
                          <View
                            onClick={(e: any) => { e.stopPropagation(); switchMeal(entry.id, 1) }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: mealIdx < entry.allMeals.length - 1 ? 'var(--primary)' : 'var(--border)',
                              opacity: mealIdx < entry.allMeals.length - 1 ? 1 : 0.4,
                            }}
                          >
                            <Text style={{ fontSize: '16px', color: mealIdx < entry.allMeals.length - 1 ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}>→</Text>
                          </View>
                        </View>
                      )}

                      {/* Photo area */}
                      <View
                        style={{
                          width: '100%',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          marginBottom: '14px',
                          border: currentMeal.photoTaken ? '2px solid var(--secondary)' : '2px dashed var(--border)',
                          background: currentMeal.photoTaken ? 'var(--muted)' : 'var(--card)',
                          aspectRatio: '4/3',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {currentMeal.photoTaken ? (
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
                          {currentMeal.foodDesc || '【未填写】'}
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
                            {currentMeal.startTime || '--'}
                          </HandwrittenLabel>
                          <Text style={{ color: 'var(--muted-foreground)' }}>→</Text>
                          <HandwrittenLabel size="base" color="var(--foreground)">
                            {currentMeal.endTime || '--'}
                          </HandwrittenLabel>
                          <Text style={{ color: 'var(--muted-foreground)', marginLeft: '8px' }}>
                            · {currentMeal.duration ? `${currentMeal.duration}分钟` : '--分钟'}
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
                          {currentMeal.chewFreq || 0} 次/口
                        </HandwrittenLabel>
                      </View>

                      {/* Tags row: location */}
                      {currentMeal.location && (
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
                                {currentMeal.location}
                              </ChineseHandwritten>
                            </View>
                            {currentMeal.companions.map((c) => (
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
                      {currentMeal.mealScenes.length > 0 && (
                        <View style={{ marginBottom: '10px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '16px' }}>🍽️</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              用餐场景
                            </ChineseHandwritten>
                          </View>
                          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {currentMeal.mealScenes.map((s: string) => (
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
                      {currentMeal.media.length > 0 && (
                        <View style={{ marginBottom: '10px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '16px' }}>📱</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              媒体使用
                            </ChineseHandwritten>
                          </View>
                          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {currentMeal.media.map((m: string) => (
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
                                  fontSize: n <= (currentMeal.moodBefore || 0) ? '24px' : '20px',
                                  filter: n <= (currentMeal.moodBefore || 0) ? 'none' : 'grayscale(0.5)',
                                  opacity: n <= (currentMeal.moodBefore || 0) ? 1 : 0.4,
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
                                  fontSize: n <= (currentMeal.satisfaction || 0) ? '24px' : '20px',
                                  filter: n <= (currentMeal.satisfaction || 0) ? 'none' : 'grayscale(0.5)',
                                  opacity: n <= (currentMeal.satisfaction || 0) ? 1 : 0.4,
                                }}
                              >
                                {['😞', '😕', '😐', '😊', '😄'][n - 1]}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </View>

                      {/* Notes */}
                      {currentMeal.notes && (
                        <View style={{ marginBottom: '4px' }}>
                          <View style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <Text style={{ fontSize: '16px' }}>📝</Text>
                            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                              备注
                            </ChineseHandwritten>
                          </View>
                          <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block' }}>
                            {currentMeal.notes}
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
          })
        )}
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
