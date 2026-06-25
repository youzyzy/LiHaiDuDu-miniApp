import React, { useState, useCallback } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  WashiTape,
  ChineseHandwritten,
  HandwrittenLabel,
  PencilDivider,
} from '../../components/SharedElements'

// ===== 工具函数 =====

function parseDurationVal(d: any): number {
  if (typeof d === 'number') return d
  if (typeof d === 'string') { const n = parseInt(d); return isNaN(n) ? 0 : n }
  return 0
}

function formatShortDate(dateStr: string): string {
  const m = dateStr.match(/(\d+)年(\d+)月(\d+)日/)
  if (!m) return dateStr
  return `${parseInt(m[2])}月${parseInt(m[3])}日`
}

const ENV_COLORS = ['#8FA98A', '#D4856A', '#C4A882', '#B8866E', '#E8C5A0', '#9BB5C4', '#C4A0D4']

// ===== 子组件 =====

function StatCard({
  icon,
  value,
  unit,
  label,
  sublabel,
  color = 'var(--card)',
}: {
  icon: string
  value: string | number
  unit?: string
  label: string
  sublabel?: string
  color?: string
}) {
  return (
    <View
      style={{
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        background: color,
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <Text style={{ fontSize: '22px' }}>{icon}</Text>
      <View style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <HandwrittenLabel size="xl" color="var(--primary)">
          {value}
        </HandwrittenLabel>
        {unit && (
          <ChineseHandwritten size="sm" color="var(--muted-foreground)">
            {unit}
          </ChineseHandwritten>
        )}
      </View>
      <ChineseHandwritten size="sm" color="var(--foreground)" style={{ textAlign: 'center' }}>
        {label}
      </ChineseHandwritten>
      {sublabel && (
        <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ textAlign: 'center' }}>
          {sublabel}
        </HandwrittenLabel>
      )}
    </View>
  )
}

/**
 * 简易柱状图占位（recharts 暂不可用）
 * 用 View 高度模拟柱状图
 */
function SimpleBarChart({
  data,
  dataKey,
  labelKey,
  color = 'var(--accent)',
  maxValue,
  unit = '',
}: {
  data: { [key: string]: string | number }[]
  dataKey: string
  labelKey: string
  color?: string
  maxValue?: number
  unit?: string
}) {
  const max = maxValue || Math.max(...data.map((d) => Number(d[dataKey])))
  return (
    <View style={{ paddingTop: '8px' }}>
      <View style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingBottom: '24px' }}>
        {data.map((item, i) => {
          const val = Number(item[dataKey])
          const height = (val / max) * 120
          return (
            <View key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: '20px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
                {val}{unit}
              </Text>
              <View
                style={{
                  width: '28px',
                  height: `${height}px`,
                  borderRadius: '4px 4px 0 0',
                  background: color,
                  minHeight: '4px',
                }}
              />
              <Text style={{ fontSize: '22px', fontFamily: "'STKaiti', 'KaiTi', serif", color: 'var(--muted-foreground)', marginTop: '6px' }}>
                {item[labelKey]}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

function DonutChart({
  data, size = 140, strokeWidth = 24,
}: {
  data: { name: string; value: number; color: string }[]
  size?: number; strokeWidth?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <View style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 12 }}><ChineseHandwritten size="sm" color="var(--muted-foreground)">暂无数据</ChineseHandwritten></View>

  const half = size / 2
  return (
    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingBottom: 12 }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, borderRadius: '50%', border: `${strokeWidth}px solid var(--muted)`, boxSizing: 'border-box' }} />
        {(() => { let cumDeg = -90; const arcs: React.ReactNode[] = []; data.forEach((d, i) => { const sweep = (d.value / total) * 360; const start = cumDeg; cumDeg += sweep; arcs.push(<View key={i} style={{ position: 'absolute', top: 0, left: 0, width: size, height: half, overflow: 'hidden' }}><View style={{ width: size, height: size, borderRadius: '50%', border: `${strokeWidth}px solid transparent`, borderTopColor: d.color, borderRightColor: sweep >= 45 ? d.color : 'transparent', transform: `rotate(${start}deg)`, boxSizing: 'border-box' }} /></View>) }); return arcs })()}
        <View style={{ position: 'absolute', top: strokeWidth, left: strokeWidth, right: strokeWidth, bottom: strokeWidth, borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ textAlign: 'center' }}><HandwrittenLabel size="xl" color="var(--primary)">{total}</HandwrittenLabel><ChineseHandwritten size="sm" color="var(--muted-foreground)">餐</ChineseHandwritten></View>
        </View>
      </View>
      <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px', paddingLeft: '8px', paddingRight: '8px' }}>
        {data.map((d) => (<View key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><View style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color, flexShrink: 0 }} /><ChineseHandwritten size="sm" color="var(--foreground)">{d.name}</ChineseHandwritten><HandwrittenLabel size="sm" color="var(--muted-foreground)">{d.value}</HandwrittenLabel></View>))}
      </View>
    </View>
  )
}

// ===== 主组件 =====

export default function WeeklySummaryPage() {
  // ===== 从云数据库拉取全部记录 =====
  const [allRecords, setAllRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [photoTempUrls, setPhotoTempUrls] = useState<Record<string, string>>({})

  const fetchAllRecords = useCallback(async () => {
    setLoading(true)
    try {
      if (!Taro.cloud) { setLoading(false); return }
      const res = await Taro.cloud.callFunction({ name: 'getRecords' })
      const result = res.result as any
      if (result?.success && result.records) {
        setAllRecords(result.records)
        // 异步获取照片临时 URL
        const withPhotos = result.records.filter((r: any) => r.photoTaken && r.photoFileID)
        if (withPhotos.length > 0) {
          const fileIDs = withPhotos.map((r: any) => r.photoFileID)
          const urlRes = await Taro.cloud.getTempFileURL({ fileList: fileIDs })
          const urlMap: Record<string, string> = {}
          urlRes.fileList.forEach((item: any, i: number) => {
            if (item.tempFileURL) urlMap[withPhotos[i]._id] = item.tempFileURL
          })
          setPhotoTempUrls(urlMap)
        }
      } else {
        setAllRecords([])
      }
    } catch (err) {
      console.error('获取总结数据失败:', err)
      setAllRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  useDidShow(() => { fetchAllRecords() })

  // ===== 从 allRecords 计算所有数据 =====

  // 按日期分组并排序
  const groupedByDate = new Map<string, any[]>()
  allRecords.forEach(r => {
    const d = r.date || ''
    if (!groupedByDate.has(d)) groupedByDate.set(d, [])
    groupedByDate.get(d)!.push(r)
  })
  const sortedDates = Array.from(groupedByDate.keys()).sort()

  // 日期范围显示
  const firstDate = sortedDates[0] ? formatShortDate(sortedDates[0]) : ''
  const lastDate = sortedDates[sortedDates.length - 1] ? formatShortDate(sortedDates[sortedDates.length - 1]) : ''
  const dateRange = firstDate && lastDate ? `${firstDate} – ${lastDate}` : ''
  const totalMeals = allRecords.length
  const recordedDays = sortedDates.length

  // 各维度统计数据
  const allDurations = allRecords.map(r => parseDurationVal(r.duration)).filter(d => d > 0)
  const avgDuration = allDurations.length > 0 ? Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length) : 0

  const allChews = allRecords.map(r => r.chewFreq || 0).filter(c => c > 0)
  const avgChew = allChews.length > 0 ? Math.round(allChews.reduce((a, b) => a + b, 0) / allChews.length) : 0

  // 最长 & 最短用餐时间记录
  const recordsWithDuration = allRecords
    .map(r => ({ ...r, _dur: parseDurationVal(r.duration) }))
    .filter(r => r._dur > 0)
    .sort((a, b) => b._dur - a._dur)
  const maxDurationRecord = recordsWithDuration[0] || null
  const minDurationRecord = recordsWithDuration[recordsWithDuration.length - 1] || null
  const maxDurVal = maxDurationRecord?._dur || 0
  const minDurVal = minDurationRecord?._dur || 0

  // 展开状态
  const [expandedStat, setExpandedStat] = useState<string | null>(null)

  // 每日趋势数据
  const durationData = sortedDates.map(date => {
    const records = groupedByDate.get(date)!
    const durations = records.map(r => parseDurationVal(r.duration)).filter(d => d > 0)
    return {
      day: formatShortDate(date),
      duration: durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0,
      target: 25,
    }
  })

  const chewData = sortedDates.map(date => {
    const records = groupedByDate.get(date)!
    const chews = records.map(r => r.chewFreq || 0).filter(c => c > 0)
    return {
      day: formatShortDate(date),
      chew: chews.length > 0 ? Math.round(chews.reduce((a, b) => a + b, 0) / chews.length) : 0,
    }
  })

  // 进食环境分布
  const locationCounts = new Map<string, number>()
  allRecords.forEach(r => {
    const loc = r.location || '其他'
    locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1)
  })
  const environmentData = Array.from(locationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, color: ENV_COLORS[i % ENV_COLORS.length] }))

  // 餐前心情 & 餐后满足感按时间段对比
  const moodByTimeData = (() => {
    const buckets: { time: string; moodBefore: number; satisfaction: number; count: number }[] = [
      { time: '早餐 6-10时', moodBefore: 0, satisfaction: 0, count: 0 },
      { time: '午餐 10-14时', moodBefore: 0, satisfaction: 0, count: 0 },
      { time: '下午 14-17时', moodBefore: 0, satisfaction: 0, count: 0 },
      { time: '晚餐 17-22时', moodBefore: 0, satisfaction: 0, count: 0 },
    ]
    allRecords.forEach(r => {
      const hour = parseInt((r.startTime || '0').split(':')[0]) || 0
      const mb = r.moodBefore || 0
      const sat = r.satisfaction || 0
      let idx = 3
      if (hour >= 6 && hour < 10) idx = 0
      else if (hour >= 10 && hour < 14) idx = 1
      else if (hour >= 14 && hour < 17) idx = 2
      if (mb > 0) { buckets[idx].moodBefore += mb }
      if (sat > 0) { buckets[idx].satisfaction += sat }
      if (mb > 0 || sat > 0) { buckets[idx].count++ }
    })
    return buckets
      .filter(b => b.count > 0)
      .map(b => ({
        time: b.time,
        moodBefore: Math.round((b.moodBefore / b.count) * 10) / 10,
        satisfaction: Math.round((b.satisfaction / b.count) * 10) / 10,
      }))
  })()

  // 照片列表
  const photoList = allRecords
    .filter(r => r.photoTaken && r.photoFileID)
    .sort((a, b) => {
      const da = `${a.date || ''} ${a.startTime || ''}`
      const db = `${b.date || ''} ${b.startTime || ''}`
      return db.localeCompare(da)
    })
    .map(r => ({
      id: r._id,
      tempUrl: photoTempUrls[r._id] || '',
      date: r.date || '',
      startTime: r.startTime || '',
      foodDesc: r.foodDesc || '',
      mealType: r.mealType || '',
    }))

  return (
    <View style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
      {/* Washi tape decoration */}
      <WashiTape
        color="#C4D9C4"
        width={120}
        rotation={-1.5}
        pattern="stripes"
        style={{ top: '12px', left: '8px' }}
      />
      <WashiTape
        color="#F2C4C4"
        width={80}
        rotation={2}
        pattern="dots"
        style={{ top: '12px', right: '16px' }}
      />

      {/* Header */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px', paddingBottom: '16px' }}>
        <ChineseHandwritten size="2xl" color="var(--primary)" style={{ display: 'block' }}>
          本周总结
        </ChineseHandwritten>
        <HandwrittenLabel size="base" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '2px' }}>
          {dateRange && `${dateRange} · `}共 {recordedDays} 天
        </HandwrittenLabel>
        <View style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Text
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
              fontFamily: "'Segoe Script', cursive",
              fontSize: '13px',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
            }}
          >
            研究第 1–{recordedDays} 天
          </Text>
          <Text
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
              fontFamily: "'Segoe Script', cursive",
              fontSize: '13px',
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
            }}
          >
            共记录 {totalMeals} 餐
          </Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <View style={{ width: '47%' }}>
          <StatCard icon="⏱️" value={avgDuration} unit="分钟" label="平均进食时长" sublabel="Avg meal duration" />
        </View>
        <View style={{ width: '47%' }}>
          <StatCard icon="🦷" value={avgChew} unit="次/分" label="平均咀嚼频率" sublabel="Avg chewing rate" color="var(--muted)" />
        </View>
        <View style={{ width: '47%' }}>
          <View
            onClick={() => setExpandedStat(expandedStat === 'longest' ? null : 'longest')}
            style={{ cursor: 'pointer' }}
          >
            <StatCard
              icon="🐢"
              value={maxDurVal || '--'}
              unit="分钟"
              label="最长用餐时间"
              sublabel="Longest meal"
              color={expandedStat === 'longest' ? 'var(--secondary)' : 'var(--card)'}
            />
          </View>
        </View>
        <View style={{ width: '47%' }}>
          <View
            onClick={() => setExpandedStat(expandedStat === 'shortest' ? null : 'shortest')}
            style={{ cursor: 'pointer' }}
          >
            <StatCard
              icon="🐇"
              value={minDurVal || '--'}
              unit="分钟"
              label="最短用餐时间"
              sublabel="Shortest meal"
              color={expandedStat === 'shortest' ? 'var(--secondary)' : 'var(--muted)'}
            />
          </View>
        </View>
      </View>

      {/* 展开详情 */}
      {expandedStat && (
        <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
          <View
            style={{
              borderRadius: '12px',
              padding: '16px',
              background: 'var(--card)',
              border: '1px solid var(--secondary)',
              boxShadow: '0 4px 16px rgba(139,94,60,0.1)',
            }}
          >
            {(() => {
              const record = expandedStat === 'longest' ? maxDurationRecord : minDurationRecord
              if (!record) return (
                <ChineseHandwritten size="sm" color="var(--muted-foreground)">
                  暂无数据
                </ChineseHandwritten>
              )
              const shortDate = (record.date || '').replace(/^\d+年/, '')
              return (
                <View>
                  <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Text style={{ fontSize: '20px' }}>{expandedStat === 'longest' ? '🐢' : '🐇'}</Text>
                    <ChineseHandwritten size="base" color="var(--primary)">
                      {expandedStat === 'longest' ? '最长用餐' : '最短用餐'} · {shortDate}
                    </ChineseHandwritten>
                  </View>
                  <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <View style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Text style={{ fontSize: '16px' }}>⏱️</Text>
                      <HandwrittenLabel size="sm" color="var(--foreground)">
                        {record.startTime || '--'} → {record.endTime || '--'}
                      </HandwrittenLabel>
                    </View>
                    <View style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Text style={{ fontSize: '16px' }}>🕐</Text>
                      <HandwrittenLabel size="sm" color="var(--foreground)">
                        {record._dur} 分钟
                      </HandwrittenLabel>
                    </View>
                  </View>
                  {record.foodDesc && (
                    <View style={{ marginBottom: '6px' }}>
                      <ChineseHandwritten size="sm" color="var(--foreground)">
                        🍽️ {record.foodDesc}
                      </ChineseHandwritten>
                    </View>
                  )}
                  <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {record.location && (
                      <View style={{ padding: '2px 8px', borderRadius: '9999px', background: 'var(--primary)' }}>
                        <ChineseHandwritten size="sm" color="var(--primary-foreground)">
                          📍{record.location}
                        </ChineseHandwritten>
                      </View>
                    )}
                    {record.companions?.map((c: string) => (
                      <View key={c} style={{ padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--border)', background: 'var(--card)' }}>
                        <ChineseHandwritten size="sm" color="var(--foreground)">👤{c}</ChineseHandwritten>
                      </View>
                    ))}
                    {record.satisfaction > 0 && (
                      <View style={{ padding: '2px 8px', borderRadius: '9999px', background: 'var(--muted)' }}>
                        <ChineseHandwritten size="sm" color="var(--foreground)">
                          ✨满足感 {record.satisfaction}/5
                        </ChineseHandwritten>
                      </View>
                    )}
                    {record.moodBefore > 0 && (
                      <View style={{ padding: '2px 8px', borderRadius: '9999px', background: 'var(--muted)' }}>
                        <ChineseHandwritten size="sm" color="var(--foreground)">
                          🌱餐前心情 {record.moodBefore}/5
                        </ChineseHandwritten>
                      </View>
                    )}
                  </View>
                </View>
              )
            })()}
          </View>
        </View>
      )}

      <PencilDivider label="进食时长趋势" />

      {/* Duration trend chart */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>📈</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            进食时长趋势（分钟）
          </ChineseHandwritten>
        </View>

        <View
          style={{
            borderRadius: '12px',
            padding: '12px',
            paddingBottom: '16px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <SimpleBarChart
            data={durationData}
            dataKey="duration"
            labelKey="day"
            color="var(--accent)"
            unit="min"
            maxValue={50}
          />
        </View>
      </View>

      <PencilDivider label="咀嚼频率" />

      {/* Chewing frequency chart */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>🦷</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            每日咀嚼频率（次/分钟）
          </ChineseHandwritten>
        </View>

        <View
          style={{
            borderRadius: '12px',
            padding: '12px',
            paddingBottom: '16px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          {/* [图表占位] 原 recharts BarChart → SimpleBarChart */}
          <SimpleBarChart
            data={chewData}
            dataKey="chew"
            labelKey="day"
            color="var(--accent)"
            unit=""
            maxValue={25}
          />
        </View>
      </View>

      <PencilDivider label="进食环境分布" />

      {/* Environment distribution */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>🗺️</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            进食环境分布
          </ChineseHandwritten>
        </View>

        <View
          style={{
            borderRadius: '12px',
            padding: '12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <DonutChart data={environmentData} />
        </View>
      </View>

      <PencilDivider label="心情对比" />

      {/* 餐前心情 vs 餐后满足感 按时间段 */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>🌱✨</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            餐前心情 vs 餐后满足
          </ChineseHandwritten>
        </View>

        <View
          style={{
            borderRadius: '12px',
            padding: '12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          {moodByTimeData.length > 0 ? (
            <View style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 表头 */}
              <View style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px', paddingRight: '4px' }}>
                <Text style={{ flex: 1, fontSize: '20px', fontFamily: "'STKaiti','KaiTi',serif", color: 'var(--muted-foreground)' }}>时间段</Text>
                <Text style={{ width: '70px', textAlign: 'center', fontSize: '20px', fontFamily: "'STKaiti','KaiTi',serif", color: 'var(--muted-foreground)' }}>餐前</Text>
                <Text style={{ width: '70px', textAlign: 'center', fontSize: '20px', fontFamily: "'STKaiti','KaiTi',serif", color: 'var(--muted-foreground)' }}>餐后</Text>
              </View>
              {moodByTimeData.map((row) => (
                <View key={row.time} style={{ display: 'flex', alignItems: 'center', padding: '8px 4px', borderRadius: '8px', background: 'var(--muted)' }}>
                  <ChineseHandwritten size="sm" color="var(--foreground)" style={{ flex: 1 }}>{row.time}</ChineseHandwritten>
                  {/* 餐前心情条 */}
                  <View style={{ width: '70px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                    <View style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--muted)' }}>
                      <View style={{ height: '100%', borderRadius: '4px', width: `${(row.moodBefore / 5) * 100}%`, background: 'var(--accent)' }} />
                    </View>
                    <HandwrittenLabel size="sm" color="var(--foreground)">{row.moodBefore}</HandwrittenLabel>
                  </View>
                  {/* 餐后满足条 */}
                  <View style={{ width: '70px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                    <View style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--muted)' }}>
                      <View style={{ height: '100%', borderRadius: '4px', width: `${(row.satisfaction / 5) * 100}%`, background: 'var(--secondary)' }} />
                    </View>
                    <HandwrittenLabel size="sm" color="var(--foreground)">{row.satisfaction}</HandwrittenLabel>
                  </View>
                </View>
              ))}
              {/* 图例 */}
              <View style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
                <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <View style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)' }} />
                  <ChineseHandwritten size="sm" color="var(--muted-foreground)">🌱餐前心情</ChineseHandwritten>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <View style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--secondary)' }} />
                  <ChineseHandwritten size="sm" color="var(--muted-foreground)">✨餐后满足</ChineseHandwritten>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
              <ChineseHandwritten size="sm" color="var(--muted-foreground)">暂无数据</ChineseHandwritten>
            </View>
          )}
        </View>
      </View>

      <PencilDivider label="美食照片墙" />

      {/* Photo Wall */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>📸</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            美食照片墙
          </ChineseHandwritten>
          <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ marginLeft: '4px' }}>
            · Photo Wall
          </HandwrittenLabel>
        </View>

        {loading ? (
          <View
            style={{
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              background: 'var(--card)',
              border: '1px dashed var(--border)',
            }}
          >
            <Text style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>⏳</Text>
            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
              加载照片中...
            </ChineseHandwritten>
          </View>
        ) : photoList.length === 0 ? (
          <View
            style={{
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              background: 'var(--card)',
              border: '1px dashed var(--border)',
            }}
          >
            <Text style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📷</Text>
            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
              还没有美食照片
            </ChineseHandwritten>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
              在用餐记录中拍照，照片会出现在这里
            </HandwrittenLabel>
          </View>
        ) : (
          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {photoList.map((photo) => {
              // 短日期格式：去掉年份 "2026年6月25日" → "6月25日"
              const shortDate = photo.date
                ? photo.date.replace(/^\d+年/, '')
                : ''
              return (
                <View
                  key={photo.id}
                  style={{
                    width: 'calc(33.33% - 7px)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(139,94,60,0.08)',
                  }}
                >
                  {/* 图片 */}
                  <View
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      overflow: 'hidden',
                      background: 'var(--muted)',
                      position: 'relative',
                    }}
                  >
                    {photo.tempUrl ? (
                      <Image
                        src={photo.tempUrl}
                        mode="aspectFill"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontSize: '28px' }}>🥗</Text>
                      </View>
                    )}
                  </View>
                  {/* 底部信息 */}
                  <View style={{ padding: '6px 8px' }}>
                    <Text
                      style={{
                        fontSize: '18px',
                        fontFamily: "'STKaiti', 'KaiTi', serif",
                        color: 'var(--muted-foreground)',
                        display: 'block',
                        lineHeight: 1.3,
                      }}
                    >
                      {shortDate}
                    </Text>
                    {photo.foodDesc && (
                      <Text
                        style={{
                          fontSize: '16px',
                          fontFamily: "'STKaiti', 'KaiTi', serif",
                          color: 'var(--foreground)',
                          display: 'block',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {photo.foodDesc}
                      </Text>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </View>

    </View>
  )
}
