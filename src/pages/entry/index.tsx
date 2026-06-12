import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  WashiTape,
  StickyNote,
  PaperRuledLines,
  NotebookMarginLine,
  ChineseHandwritten,
  HandwrittenLabel,
  EmojiRating,
  TagChip,
  PencilDivider,
  PaperTextarea,
} from '../../components/SharedElements'

const LOCATIONS = ['家里', '宿舍', '餐厅', '食堂', '办公室', '路上', '咖啡厅', '其他']
const COMPANIONS = ['独自', '家人', '朋友', '同事', '伴侣']
const MEAL_SCENES = ['工作/课程间隙', '聚餐', '日常家庭用餐', '吃漂亮饭', '其他']
const MEDIA = ['手机', '电视', '电脑', '音乐', '播客', '无']
const HUNGER_TIMING = ['15分钟', '30分钟', '1小时', '2小时', '3小时+']

interface FormState {
  foodDesc: string
  photoTaken: boolean
  photoPath: string
  startTime: string
  endTime: string
  chewFreq: number
  location: string
  companions: string[]
  mealScenes: string[]
  media: string[]
  satisfaction: number
  hungerReturn: string
  moodBefore: number
  notes: string
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <View style={{ flex: 1 }}>
      <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginBottom: '4px' }}>
        {label}
      </ChineseHandwritten>
      <Input
        type="text"
        value={value}
        onInput={(e) => onChange(e.detail.value)}
        placeholder="12:00"
        style={{
          width: '100%',
          outline: 'none',
          background: 'transparent',
          borderBottom: '2px solid var(--paper-margin)',
          paddingBottom: '4px',
          textAlign: 'center',
          fontFamily: "'Segoe Script', cursive",
          fontSize: '20px',
          color: 'var(--foreground)',
        }}
      />
      <Text style={{ fontSize: '20px', color: 'var(--muted-foreground)', display: 'block', textAlign: 'center', marginTop: '2px' }}>
        (例 12:00)
      </Text>
    </View>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '20px' }}>
      <View style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Text style={{ fontSize: '18px' }}>{icon}</Text>
        <ChineseHandwritten size="base" color="var(--primary)">
          {title}
        </ChineseHandwritten>
      </View>
      {children}
    </View>
  )
}

function ChewCounter({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <View
        onClick={() => onChange(Math.max(0, value - 5))}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--muted)',
          border: '2px dashed var(--border)',
        }}
      >
        <Text style={{ fontSize: '16px', color: 'var(--foreground)' }}>−</Text>
      </View>
      <View style={{ textAlign: 'center' }}>
        <HandwrittenLabel size="2xl" color="var(--primary)">
          {value}
        </HandwrittenLabel>
        <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
          次/口
        </ChineseHandwritten>
      </View>
      <View
        onClick={() => onChange(value + 5)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--primary)',
        }}
      >
        <Text style={{ fontSize: '16px', color: 'var(--primary-foreground)' }}>+</Text>
      </View>
    </View>
  )
}

export default function MealEntryPage() {
  const getDateString = () => {
    const now = new Date()
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  }

  const [form, setForm] = useState<FormState>({
    foodDesc: '',
    photoTaken: false,
    photoPath: '',
    startTime: '12:00',
    endTime: '12:28',
    chewFreq: 15,
    location: '',
    companions: [],
    mealScenes: [],
    media: [],
    satisfaction: 0,
    hungerReturn: '',
    moodBefore: 0,
    notes: '',
  })

  const [saved, setSaved] = useState(false)
  const [mealNumber, setMealNumber] = useState(1)
  const [showMealPicker, setShowMealPicker] = useState(false)
  const [pressedMeal, setPressedMeal] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | ''>('lunch')

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArr = (key: 'companions' | 'mealScenes' | 'media', val: string) => {
    setForm((prev) => {
      const arr = prev[key]
      const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
      return { ...prev, [key]: next }
    })
  }

  const durationMinutes = (() => {
    const [sh, sm] = form.startTime.split(':').map(Number)
    const [eh, em] = form.endTime.split(':').map(Number)
    const diff = eh * 60 + em - (sh * 60 + sm)
    return diff > 0 ? diff : '--'
  })()

  const handleSave = () => {
    setSaved(true)
    Taro.showToast({ title: '记录已保存', icon: 'success', duration: 2000 })
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTakePhoto = () => {
    // TODO: 模拟器中 Taro.chooseImage 不可用，暂时用模拟拍照
    // 真机调试时取消下方注释即可启用真实拍照
    /*
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        update('photoTaken', true)
        update('photoPath', res.tempFilePaths[0])
      },
      fail: () => {
        // Fallback: mark as taken even if camera fails
        update('photoTaken', true)
      },
    })
    */
    // 模拟拍照：直接标记已拍照（模拟器中不调用真实相机 API）
    update('photoTaken', true)
    Taro.showToast({ title: '模拟拍照成功（真机将调用相机）', icon: 'none', duration: 1500 })
  }

  const handleBack = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  return (
    <View style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
      {/* Header */}
      <View
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(139,94,60,0.08)',
        }}
      >
        <View onClick={handleBack} style={{ padding: '4px' }}>
          <Text style={{ fontSize: '22px', color: 'var(--foreground)' }}>←</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ChineseHandwritten size="lg" color="var(--primary)">
            用餐记录
          </ChineseHandwritten>
          <HandwrittenLabel size="sm" color="var(--muted-foreground)" style={{ display: 'block' }}>
            {getDateString()}
          </HandwrittenLabel>
        </View>
        <WashiTape
          color="#F2DBA4"
          width={50}
          rotation={-2}
          pattern="dots"
          style={{ top: '8px', right: '64px' }}
        />
        <View
          onClick={handleSave}
          style={{
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: saved ? 'var(--secondary)' : 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          {saved && <Text style={{ fontSize: '14px' }}>✓</Text>}
          <ChineseHandwritten size="sm" color="var(--primary-foreground)">
            {saved ? '已保存' : '保存'}
          </ChineseHandwritten>
        </View>
      </View>

      {/* Meal number badge */}
      <View style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <View style={{ position: 'relative' }}>
          <View onClick={() => setShowMealPicker(!showMealPicker)}>
            <StickyNote
              color="#FFF3A3"
              rotation={-1.5}
              className="rounded-lg"
              style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '1px', paddingBottom: '1px' }}
            >
              <ChineseHandwritten size="xs" color="var(--foreground)">
                🍽️ 第 {mealNumber} 餐
              </ChineseHandwritten>
            </StickyNote>
          </View>
          {showMealPicker && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                zIndex: 100,
                background: 'var(--card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {[1, 2, 3].map((n) => (
                <View
                  key={n}
                  onClick={() => {
                    setMealNumber(n)
                    setShowMealPicker(false)
                  }}
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    background: mealNumber === n ? 'var(--accent)' : 'transparent',
                  }}
                >
                  <ChineseHandwritten size="sm" color={mealNumber === n ? 'var(--accent-foreground)' : 'var(--foreground)'}>
                    第 {n} 餐
                  </ChineseHandwritten>
                </View>
              ))}
            </View>
          )}
        </View>
        <View
          onClick={() => {
            setPressedMeal('breakfast')
            setTimeout(() => setPressedMeal(''), 150)
          }}
          style={{ transform: pressedMeal === 'breakfast' ? 'scale(0.9)' : 'scale(1)' }}
        >
          <StickyNote color="#FFD6D6" rotation={-1} className="rounded-lg" style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '1px', paddingBottom: '1px' }}>
            <ChineseHandwritten size="xs" color="var(--foreground)">
              早餐
            </ChineseHandwritten>
          </StickyNote>
        </View>
        <View
          onClick={() => {
            setPressedMeal('lunch')
            setTimeout(() => setPressedMeal(''), 150)
          }}
          style={{ transform: pressedMeal === 'lunch' ? 'scale(0.9)' : 'scale(1)' }}
        >
          <StickyNote color="#D6F0D6" rotation={1} className="rounded-lg" style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '1px', paddingBottom: '1px' }}>
            <ChineseHandwritten size="xs" color="var(--foreground)">
              午餐
            </ChineseHandwritten>
          </StickyNote>
        </View>
        <View
          onClick={() => {
            setPressedMeal('dinner')
            setTimeout(() => setPressedMeal(''), 150)
          }}
          style={{ transform: pressedMeal === 'dinner' ? 'scale(0.9)' : 'scale(1)' }}
        >
          <StickyNote color="#D6E8FF" rotation={-1.5} className="rounded-lg" style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '1px', paddingBottom: '1px' }}>
            <ChineseHandwritten size="xs" color="var(--foreground)">
              晚餐
            </ChineseHandwritten>
          </StickyNote>
        </View>
      </View>

      {/* === SECTION: Food Description === */}
      <Section icon="✏️" title="食物描述">
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
          <PaperRuledLines lineHeight={40} />
          <NotebookMarginLine left={40} />
          <View style={{ paddingLeft: '48px', position: 'relative', zIndex: 10 }}>
            <PaperTextarea
              value={form.foodDesc}
              onChange={(v) => update('foodDesc', v)}
              placeholder="今天吃了什么？描述食物口感、分量..."
              rows={4}
              style={{ paddingTop: '12px' }}
            />
          </View>
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Food Photo === */}
      <Section icon="📷" title="食物照片">
        <View
          onClick={handleTakePhoto}
          style={{
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            border: form.photoTaken ? '2px solid var(--secondary)' : '2px dashed var(--border)',
            background: form.photoTaken ? 'var(--muted)' : 'var(--card)',
            aspectRatio: '4/3',
          }}
        >
          {form.photoTaken ? (
            <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Text style={{ fontSize: '40px' }}>🥗</Text>
              <ChineseHandwritten size="sm" color="var(--secondary)">
                已拍照 · 点击重拍
              </ChineseHandwritten>
            </View>
          ) : (
            <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <View
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--muted)',
                }}
              >
                <Text style={{ fontSize: '28px', color: 'var(--muted-foreground)' }}>📷</Text>
              </View>
              <ChineseHandwritten size="base" color="var(--muted-foreground)">
                拍摄食物照片
              </ChineseHandwritten>
              <HandwrittenLabel size="sm" color="var(--muted-foreground)">
                Tap to take a photo of your meal
              </HandwrittenLabel>
            </View>
          )}
          {/* Polaroid border decoration */}
          <WashiTape
            color="#F2C4C4"
            width={70}
            rotation={2}
            pattern="stripes"
            style={{ top: '8px', left: '8px' }}
          />
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Time & Duration === */}
      <Section icon="⏱️" title="进食时间">
        <View
          style={{ borderRadius: '12px', padding: '16px', background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <View style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TimeInput
              label="开始时间"
              value={form.startTime}
              onChange={(v) => update('startTime', v)}
            />
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ color: 'var(--muted-foreground)', fontSize: '18px' }}>→</Text>
            </View>
            <TimeInput
              label="结束时间"
              value={form.endTime}
              onChange={(v) => update('endTime', v)}
            />
          </View>

          <View
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              borderTop: '1px dashed var(--border)',
            }}
          >
            <Text style={{ fontSize: '16px', color: 'var(--accent)' }}>🕐</Text>
            <ChineseHandwritten size="base" color="var(--foreground)">
              进食时长：
            </ChineseHandwritten>
            <HandwrittenLabel size="xl" color="var(--primary)">
              {durationMinutes} {typeof durationMinutes === 'number' ? '分钟' : ''}
            </HandwrittenLabel>
          </View>
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Chewing Frequency === */}
      <Section icon="🦷" title="咀嚼频率估计">
        <View
          style={{ borderRadius: '12px', padding: '20px', background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <ChewCounter
            value={form.chewFreq}
            onChange={(v) => update('chewFreq', v)}
          />
          <View style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <View
                key={n}
                onClick={() => update('chewFreq', n)}
                style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  borderRadius: '4px',
                  fontFamily: "'Segoe Script', cursive",
                  fontSize: '13px',
                  background: form.chewFreq === n ? 'var(--primary)' : 'var(--muted)',
                  color: form.chewFreq === n ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                <Text>{n}</Text>
              </View>
            ))}
          </View>
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Eating Location === */}
      <Section icon="📍" title="进食地点">
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {LOCATIONS.map((loc) => (
            <TagChip
              key={loc}
              label={loc}
              active={form.location === loc}
              onClick={() => update('location', form.location === loc ? '' : loc)}
              color="var(--primary)"
            />
          ))}
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Companions === */}
      <Section icon="👥" title="用餐陪伴">
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {COMPANIONS.map((c) => (
            <TagChip
              key={c}
              label={c}
              active={form.companions.includes(c)}
              onClick={() => toggleArr('companions', c)}
              color="var(--secondary)"
            />
          ))}
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Meal Scene === */}
      <Section icon="🍽️" title="用餐场景">
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MEAL_SCENES.map((s) => (
            <TagChip
              key={s}
              label={s}
              active={form.mealScenes.includes(s)}
              onClick={() => toggleArr('mealScenes', s)}
              color="var(--secondary)"
            />
          ))}
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Phone/Media Usage === */}
      <Section icon="📱" title="手机及媒体使用">
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MEDIA.map((m) => (
            <TagChip
              key={m}
              label={m}
              active={form.media.includes(m)}
              onClick={() => toggleArr('media', m)}
              color="var(--accent)"
            />
          ))}
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Mood Before === */}
      <Section icon="🌱" title="餐前心情">
        <View
          style={{ borderRadius: '12px', padding: '16px', background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginBottom: '12px', textAlign: 'center' }}>
            进食前的心情状态
          </ChineseHandwritten>
          <EmojiRating
            value={form.moodBefore}
            onChange={(v) => update('moodBefore', v)}
          />
          <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)">很差</HandwrittenLabel>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)">很好</HandwrittenLabel>
          </View>
        </View>
      </Section>

      <PencilDivider />

      {/* === SECTION: Post-meal Satisfaction === */}
      <Section icon="✨" title="餐后满足感">
        <View
          style={{ borderRadius: '12px', padding: '16px', background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <ChineseHandwritten size="sm" color="var(--muted-foreground)" style={{ display: 'block', marginBottom: '12px', textAlign: 'center' }}>
            用餐后的整体满足感
          </ChineseHandwritten>
          <EmojiRating
            value={form.satisfaction}
            onChange={(v) => update('satisfaction', v)}
          />
          <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)">不满足</HandwrittenLabel>
            <HandwrittenLabel size="sm" color="var(--muted-foreground)">非常满足</HandwrittenLabel>
          </View>
        </View>
      </Section>



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
            background: saved ? 'var(--secondary)' : 'var(--primary)',
            boxShadow: '0 6px 20px rgba(139, 94, 60, 0.3)',
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
              color: 'var(--primary-foreground)',
            }}
          >
            {saved ? '✓ 记录已保存 ✓' : '保存本次记录'}
          </Text>
          {!saved && (
            <Text
              style={{
                display: 'block',
                marginTop: '2px',
                textAlign: 'center',
                fontFamily: "'Segoe Script', cursive",
                fontSize: '13px',
                color: 'rgba(251,247,238,0.7)',
              }}
            >
              Save Meal Entry
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}
