import React from 'react'
import { View, Text } from '@tarojs/components'
import {
  WashiTape,
  StickyNote,
  ChineseHandwritten,
  HandwrittenLabel,
  PencilDivider,
} from '../../components/SharedElements'

// ===== 数据定义（保留原项目所有数据） =====

const durationData = [
  { day: '周一', duration: 22, target: 25 },
  { day: '周二', duration: 12, target: 25 },
  { day: '周三', duration: 35, target: 25 },
  { day: '周四', duration: 18, target: 25 },
  { day: '周五', duration: 28, target: 25 },
  { day: '周六', duration: 40, target: 25 },
  { day: '周日', duration: 15, target: 25 },
]

const environmentData = [
  { name: '家里', value: 8, color: '#8FA98A' },
  { name: '餐厅', value: 5, color: '#D4856A' },
  { name: '食堂', value: 6, color: '#C4A882' },
  { name: '办公室', value: 3, color: '#B8866E' },
  { name: '其他', value: 2, color: '#E8C5A0' },
]

const chewData = [
  { day: '周一', chew: 14 },
  { day: '周二', chew: 11 },
  { day: '周三', chew: 18 },
  { day: '周四', chew: 13 },
  { day: '周五', chew: 16 },
  { day: '周六', chew: 20 },
  { day: '周日', chew: 12 },
]

const hungerPatterns = [
  { time: '早8时', hunger: 4.5 },
  { time: '早10时', hunger: 2.5 },
  { time: '午12时', hunger: 4.2 },
  { time: '午14时', hunger: 2.0 },
  { time: '下16时', hunger: 3.5 },
  { time: '晚18时', hunger: 4.8 },
  { time: '晚20时', hunger: 2.2 },
]

const findings = [
  {
    icon: '📉',
    zh: '工作日进食速度显著快于周末（均值差：15分钟）',
    en: 'Weekday meals significantly shorter than weekends (avg diff: 15 min)',
    color: '#FFD6D6',
    rotation: -1.2,
  },
  {
    icon: '📱',
    zh: '手机使用与进食速度呈正相关（r=0.68）',
    en: 'Phone use positively correlated with eating speed (r=0.68)',
    color: '#FFF3A3',
    rotation: 1,
  },
  {
    icon: '👥',
    zh: '独自进食时平均咀嚼频率最低（11次/分钟）',
    en: 'Solo eating associated with lowest chewing freq (11 chews/min)',
    color: '#D6F0D6',
    rotation: -0.5,
  },
  {
    icon: '🌱',
    zh: '满足感与进食时长正相关，与手机使用负相关',
    en: 'Satisfaction positively correlates with duration, negatively with phone use',
    color: '#D6E8FF',
    rotation: 1.5,
  },
]

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

/**
 * 简易折线图占位（recharts 暂不可用）
 * 用数据列表 + 文本展示代替
 */
function SimpleLineChart({
  data,
  dataKey,
  labelKey,
  color = 'var(--primary)',
  unit = '',
  maxValue,
}: {
  data: { [key: string]: string | number }[]
  dataKey: string
  labelKey: string
  color?: string
  unit?: string
  maxValue?: number
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
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  marginBottom: `${height}px`,
                }}
              />
              <Text style={{ fontSize: '20px', fontFamily: "'STKaiti', 'KaiTi', serif", color: 'var(--muted-foreground)', marginTop: '6px' }}>
                {item[labelKey]}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

/**
 * 简易饼图占位（recharts 暂不可用）
 * 用图例 + 数值列表展示
 */
function SimplePieChart({
  data,
}: {
  data: { name: string; value: number; color: string }[]
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  return (
    <View style={{ paddingTop: '8px' }}>
      {/* 简易环形图视觉效果 */}
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
        <View
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {(() => {
            let cumulativePercent = 0
            return data.map((item, i) => {
              const percent = (item.value / total) * 100
              const startPercent = cumulativePercent
              cumulativePercent += percent
              // 使用 conic-gradient 模拟饼图（小程序支持有限，回退到纯色块）
              return null // 小程序中不使用 conic-gradient
            })
          })()}
          {/* 饼图占位圆 */}
          <View
            style={{
              position: 'absolute',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--card)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '24px', fontFamily: "'Segoe Script', cursive", color: 'var(--foreground)' }}>
              {total}餐
            </Text>
          </View>
        </View>
      </View>
      {/* 图例列表 */}
      <View style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px', paddingRight: '16px' }}>
        {data.map((env) => (
          <View key={env.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <View
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                flexShrink: 0,
                background: env.color,
              }}
            />
            <ChineseHandwritten size="sm" color="var(--foreground)">
              {env.name}
            </ChineseHandwritten>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ marginLeft: 'auto' }}>
              {env.value}餐
            </HandwrittenLabel>
          </View>
        ))}
      </View>
    </View>
  )
}

// ===== 主组件 =====

export default function WeeklySummaryPage() {
  const avgDuration = Math.round(durationData.reduce((sum, d) => sum + d.duration, 0) / durationData.length)
  const avgChew = Math.round(chewData.reduce((sum, d) => sum + d.chew, 0) / chewData.length)

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
          Week 2 Summary · May 30 – Jun 5
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
            研究第 8–14 天
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
            共记录 21 餐
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
          <StatCard icon="😊" value="3.8" unit="/5" label="平均餐后满足感" sublabel="Avg satisfaction" />
        </View>
        <View style={{ width: '47%' }}>
          <StatCard icon="🏠" value="33%" unit="" label="家中进食比例" sublabel="Meals eaten at home" color="var(--muted)" />
        </View>
      </View>

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
          {/* [图表占位] 原 recharts LineChart → SimpleLineChart */}
          <SimpleLineChart
            data={durationData}
            dataKey="duration"
            labelKey="day"
            color="var(--primary)"
            unit="min"
            maxValue={50}
          />
          <Text style={{ fontSize: '22px', color: 'var(--muted-foreground)', textAlign: 'center', display: 'block', marginTop: '4px' }}>
            [图表占位] 原项目使用 recharts，点击查看详细数据
          </Text>
          <View style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <View style={{ width: '24px', height: '4px', borderRadius: '2px', background: 'var(--primary)' }} />
              <ChineseHandwritten size="sm" color="var(--muted-foreground)">实际时长</ChineseHandwritten>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <View style={{ width: '24px', height: '1px', borderTop: '2px dashed var(--muted-foreground)' }} />
              <ChineseHandwritten size="sm" color="var(--muted-foreground)">目标25分钟</ChineseHandwritten>
            </View>
          </View>
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
          {/* [图表占位] 原 recharts PieChart → SimplePieChart */}
          <SimplePieChart data={environmentData} />
        </View>
      </View>

      <PencilDivider label="饥饿感规律" />

      {/* Hunger pattern */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>🌡️</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            日内饥饿感规律（均值）
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
          {/* [图表占位] 原 recharts LineChart → SimpleLineChart */}
          <SimpleLineChart
            data={hungerPatterns}
            dataKey="hunger"
            labelKey="time"
            color="var(--secondary)"
            unit=""
            maxValue={5}
          />
          <View style={{ textAlign: 'center', marginTop: '4px' }}>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)">
              1 = 不饿 · 5 = 非常饥饿
            </HandwrittenLabel>
          </View>
        </View>
      </View>

      <PencilDivider label="研究发现" />

      {/* Research findings */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Text style={{ fontSize: '18px' }}>🔍</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            本周研究发现
          </ChineseHandwritten>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {findings.map((f, i) => (
            <View key={i} style={{ marginLeft: i % 2 === 1 ? '10px' : '0' }}>
              <StickyNote color={f.color} rotation={f.rotation} className="rounded-xl">
                <View style={{ display: 'flex', gap: '8px' }}>
                  <Text style={{ fontSize: '20px', flexShrink: 0 }}>{f.icon}</Text>
                  <View>
                    <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block' }}>
                      {f.zh}
                    </ChineseHandwritten>
                    <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                      {f.en}
                    </HandwrittenLabel>
                  </View>
                </View>
              </StickyNote>
            </View>
          ))}
        </View>
      </View>

      {/* Researcher export note */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px' }}>
        <StickyNote color="#E8D6F0" rotation={-0.8} className="rounded-xl">
          <View style={{ display: 'flex', gap: '8px' }}>
            <Text style={{ fontSize: '20px' }}>💾</Text>
            <View>
              <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block' }}>
                数据导出提示
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                All entries auto-synced to research database. Export CSV from settings for manual analysis. Next lab meeting: Jun 12.
              </HandwrittenLabel>
            </View>
          </View>
        </StickyNote>
      </View>
    </View>
  )
}
