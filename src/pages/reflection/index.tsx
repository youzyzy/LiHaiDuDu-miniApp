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
    zh: '今日最印象深刻的哪一餐？当时的感受是什么？',
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
  const [saved, setSaved] = useState(false)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const getDateString = () => {
    const now = new Date()
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  }

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
            <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginTop: '2px' }}>
              Reflection · {getDateString()}
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
