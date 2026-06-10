import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  WashiTape,
  StickyNote,
  PaperRuledLines,
  NotebookMarginLine,
  ChineseHandwritten,
  HandwrittenLabel,
  PencilDivider,
  PaperTextarea,
} from '../../components/SharedElements'

const PROMPTS = [
  {
    id: 'mindfulness',
    icon: '🌸',
    zh: '今日最印象深刻的一餐是哪餐？当时的感受是什么？',
    en: 'Which meal was most memorable today? How did it feel?',
    color: '#FFF3A3',
    rotation: -1,
  },
  {
    id: 'speed',
    icon: '⏳',
    zh: '今天进食速度如何？是否注意到自己在咀嚼？',
    en: 'How was your eating pace today? Did you notice your chewing?',
    color: '#FFD6D6',
    rotation: 1.2,
  },
  {
    id: 'environment',
    icon: '🌿',
    zh: '进食环境对今天的饮食体验有什么影响？',
    en: 'How did your eating environment influence your meal experience?',
    color: '#D6F0D6',
    rotation: -0.5,
  },
  {
    id: 'hunger',
    icon: '🌡️',
    zh: '今天能够清楚感受到饥饿信号和饱腹感吗？',
    en: 'Were you able to sense hunger and fullness cues clearly today?',
    color: '#D6E8FF',
    rotation: 0.8,
  },
  {
    id: 'distraction',
    icon: '📱',
    zh: '手机/媒体的使用如何影响了你的进食专注度？',
    en: 'How did phone/media use affect your eating focus?',
    color: '#E8D6F0',
    rotation: -1.5,
  },
]

const RESEARCH_OBSERVATIONS = [
  {
    id: 'obs1',
    label: '今日整体进食速度评估',
    en: 'Overall eating speed assessment',
    options: ['非常慢', '较慢', '适中', '较快', '非常快'],
  },
  {
    id: 'obs2',
    label: '主观饥饿感水平（全天平均）',
    en: 'Subjective hunger level (daily avg)',
    options: ['1', '2', '3', '4', '5', '6', '7'],
  },
]

function PromptCard({
  prompt,
  value,
  onChange,
}: {
  prompt: (typeof PROMPTS)[0]
  value: string
  onChange: (v: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={{ marginBottom: '20px' }}>
      <StickyNote color={prompt.color} rotation={prompt.rotation} className="rounded-xl" style={{ marginBottom: '8px' }}>
        <View
          onClick={() => setExpanded(!expanded)}
          style={{ width: '100%' }}
        >
          <View style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Text style={{ fontSize: '20px', flexShrink: 0 }}>{prompt.icon}</Text>
            <View style={{ flex: 1 }}>
              <ChineseHandwritten size="base" color="var(--foreground)" style={{ display: 'block' }}>
                {prompt.zh}
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '4px' }}>
                {prompt.en}
              </HandwrittenLabel>
            </View>
            <Text
              style={{
                marginLeft: '8px',
                flexShrink: 0,
                color: 'var(--muted-foreground)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                fontSize: '14px',
              }}
            >
              ▼
            </Text>
          </View>
        </View>
      </StickyNote>

      {expanded && (
        <View
          style={{
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            minHeight: '100px',
          }}
        >
          <PaperRuledLines />
          <NotebookMarginLine />
          <View style={{ paddingLeft: '48px', position: 'relative', zIndex: 10 }}>
            <PaperTextarea
              value={value}
              onChange={onChange}
              placeholder="写下你的想法... (Write your thoughts here)"
              rows={4}
            />
          </View>
        </View>
      )}

      {value && !expanded && (
        <View
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--muted)',
            border: '1px solid var(--border)',
          }}
        >
          <NotebookMarginLine />
          <View style={{ paddingLeft: '40px' }}>
            <ChineseHandwritten size="sm" color="var(--muted-foreground)">
              {value.length > 60 ? value.slice(0, 60) + '...' : value}
            </ChineseHandwritten>
          </View>
        </View>
      )}
    </View>
  )
}

export default function DailyReflectionPage() {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [obsValues, setObsValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [overallNote, setOverallNote] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const toggleMood = (key: string) => {
    setSelectedMoods((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const setResponse = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }))
  }

  const completedCount = PROMPTS.filter((p) => {
    const val = responses[p.id]
    return val && val.trim()
  }).length

  const handleSave = () => {
    setSaved(true)
    Taro.showToast({ title: '反思已保存', icon: 'success', duration: 2000 })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <View style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
      {/* Washi tape header accents */}
      <WashiTape
        color="#D4C4E8"
        width={140}
        rotation={-2}
        pattern="stripes"
        style={{ top: '16px', left: 0 }}
      />
      <WashiTape
        color="#F2DBA4"
        width={90}
        rotation={1.5}
        pattern="dots"
        style={{ top: '16px', right: '16px' }}
      />

      {/* Header */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Text style={{ fontSize: '22px', color: 'var(--accent)', marginTop: '4px' }}>🪶</Text>
          <View>
            <ChineseHandwritten size="2xl" color="var(--primary)" style={{ display: 'block' }}>
              每日反思
            </ChineseHandwritten>
            <HandwrittenLabel size="base" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '2px' }}>
              Daily Reflection · 2026年6月5日
            </HandwrittenLabel>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            marginTop: '16px',
            borderRadius: '9999px',
            overflow: 'hidden',
            background: 'var(--muted)',
            height: '8px',
          }}
        >
          <View
            style={{
              height: '100%',
              borderRadius: '9999px',
              width: `${(completedCount / PROMPTS.length) * 100}%`,
              background: 'var(--accent)',
            }}
          />
        </View>
        <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <ChineseHandwritten size="sm" color="var(--muted-foreground)">
            已完成 {completedCount}/{PROMPTS.length} 个问题
          </ChineseHandwritten>
          <HandwrittenLabel size="sm" color="var(--muted-foreground)">
            {Math.round((completedCount / PROMPTS.length) * 100)}% done
          </HandwrittenLabel>
        </View>
      </View>

      {/* Prompts section */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '8px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Text style={{ fontSize: '18px' }}>💬</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            反思提示
          </ChineseHandwritten>
          <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ marginLeft: '4px' }}>
            Reflection Prompts
          </HandwrittenLabel>
        </View>

        {PROMPTS.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            value={responses[prompt.id] || ''}
            onChange={(v) => setResponse(prompt.id, v)}
          />
        ))}
      </View>

      <PencilDivider label="研究观察" />

      {/* Research observations */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Text style={{ fontSize: '18px' }}>🔬</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            研究观察指标
          </ChineseHandwritten>
        </View>

        {RESEARCH_OBSERVATIONS.map((obs) => (
          <View key={obs.id} style={{ marginBottom: '16px' }}>
            <ChineseHandwritten size="sm" color="var(--foreground)" style={{ display: 'block', marginBottom: '8px' }}>
              {obs.label}
            </ChineseHandwritten>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginBottom: '8px' }}>
              {obs.en}
            </HandwrittenLabel>
            <View style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {obs.options.map((opt) => (
                <View
                  key={opt}
                  onClick={() => setObsValues((prev) => ({ ...prev, [obs.id]: opt }))}
                  style={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontFamily: "'STKaiti', 'KaiTi', serif",
                    fontSize: '14px',
                    background: obsValues[obs.id] === opt ? 'var(--primary)' : 'var(--card)',
                    color: obsValues[obs.id] === opt ? 'var(--primary-foreground)' : 'var(--foreground)',
                    borderColor: obsValues[obs.id] === opt ? 'var(--primary)' : 'var(--border)',
                    transform: obsValues[obs.id] === opt ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <Text>{opt}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <PencilDivider label="研究者备忘" />

      {/* Overall notes for researcher */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <StickyNote color="#FFF3A3" rotation={-0.5} className="rounded-xl" style={{ marginBottom: '12px' }}>
          <View style={{ display: 'flex', gap: '8px' }}>
            <Text style={{ fontSize: '18px' }}>📌</Text>
            <ChineseHandwritten size="sm" color="var(--foreground)">
              研究员可在此记录额外观察、异常情况或今日特殊事件
            </ChineseHandwritten>
          </View>
        </StickyNote>

        <View
          style={{
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            minHeight: '120px',
          }}
        >
          <PaperRuledLines />
          <NotebookMarginLine />
          <View style={{ paddingLeft: '48px', position: 'relative', zIndex: 10 }}>
            <PaperTextarea
              value={overallNote}
              onChange={setOverallNote}
              placeholder="研究者备注... (Researcher notes — special circumstances, deviations, additional observations)"
              rows={5}
            />
          </View>
        </View>
      </View>

      {/* Mood & wellbeing quick capture */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px' }}>
        <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Text style={{ fontSize: '18px' }}>🌙</Text>
          <ChineseHandwritten size="base" color="var(--primary)">
            今日整体状态
          </ChineseHandwritten>
        </View>

        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { icon: '😴', label: '疲惫', key: 'tired' },
            { icon: '😊', label: '愉快', key: 'happy' },
            { icon: '😰', label: '压力大', key: 'stressed' },
            { icon: '🤔', label: '分心', key: 'distracted' },
            { icon: '😌', label: '平静', key: 'calm' },
            { icon: '😤', label: '忙碌', key: 'busy' },
          ].map((mood) => {
            const isSelected = selectedMoods.includes(mood.key)
            return (
              <View
                key={mood.key}
                onClick={() => toggleMood(mood.key)}
                style={{
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  width: '30%',
                  background: isSelected ? 'var(--accent)' : 'var(--card)',
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <Text style={{ fontSize: '24px' }}>{mood.icon}</Text>
                <ChineseHandwritten size="sm" color={isSelected ? 'var(--accent-foreground)' : 'var(--foreground)'}>
                  {mood.label}
                </ChineseHandwritten>
              </View>
            )
          })}
        </View>
      </View>

      {/* Save button */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px' }}>
        <View
          onClick={handleSave}
          style={{
            width: '100%',
            paddingTop: '16px',
            paddingBottom: '16px',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: saved ? 'var(--secondary)' : 'var(--accent)',
            boxShadow: '0 6px 20px rgba(212, 133, 106, 0.3)',
          }}
        >
          <Text
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'STKaiti', 'KaiTi', serif",
              fontSize: '18px',
              color: 'var(--accent-foreground)',
            }}
          >
            {saved && '✓ '}
            {saved ? '反思已保存 ✓' : '保存今日反思'}
          </Text>
          {!saved && (
            <Text
              style={{
                display: 'block',
                marginTop: '2px',
                textAlign: 'center',
                fontFamily: "'Segoe Script', cursive",
                fontSize: '13px',
                color: 'rgba(251,247,238,0.75)',
              }}
            >
              Save Daily Reflection
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}
