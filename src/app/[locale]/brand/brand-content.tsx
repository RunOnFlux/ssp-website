import {
  ArrowDownToLine,
  Check,
  Download,
  ExternalLink,
  Github,
  Mail,
  Palette,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { CSSProperties, ReactNode } from 'react'
import { CopyValue } from './copy-value'

const KIT_REPO = 'https://github.com/RunOnFlux/ssp-brand-kit'
const KIT_ZIP = `${KIT_REPO}/archive/refs/heads/master.zip`
const TAGLINE = 'Secure. Simple. Powerful.'
const CONTACT_EMAIL = 'info@sspwallet.io'

// Logo files are 147×56 units: the 184×240 symbol scaled by 0.233333 plus the wordmark.
// A pillar is 46 symbol units wide, which is the clear-space unit x.
const LOGO_ASPECT = 147 / 56
const SYMBOL_ASPECT = 184 / 240
const PILLAR_WIDTH_OF_LOGO = (46 * 0.233333) / 147

const SECTIONS = [
  'logo',
  'symbol',
  'icon',
  'colors',
  'typography',
  'usage',
  'name',
  'images',
  'legal',
] as const

type Variant = 'onDark' | 'onLight' | 'black' | 'white'

const VARIANTS: Array<{ id: Variant; file: string; preview: string }> = [
  { id: 'onDark', file: 'on-dark', preview: 'bg-[#0C0A09]' },
  { id: 'onLight', file: 'on-light', preview: 'bg-white' },
  { id: 'black', file: 'black', preview: 'bg-[#FBBF24]' },
  {
    id: 'white',
    file: 'white',
    preview: 'bg-linear-to-br from-sky-700 via-indigo-600 to-fuchsia-600',
  },
]

const ICON_SHAPES = ['circle', 'square'] as const
const ICON_TONES = ['amber', 'dark', 'light'] as const

const COLORS = [
  { id: 'amber', hex: '#FBBF24', rgb: '251, 191, 36', cmyk: '0, 24, 86, 2' },
  { id: 'amberLight', hex: '#FCD34D', rgb: '252, 211, 77', cmyk: '0, 16, 69, 1' },
  { id: 'amberDeep', hex: '#F59E0B', rgb: '245, 158, 11', cmyk: '0, 36, 96, 4' },
  { id: 'amberAction', hex: '#D97706', rgb: '217, 119, 6', cmyk: '0, 45, 97, 15' },
  { id: 'graphite', hex: '#595A5A', rgb: '89, 90, 90', cmyk: '1, 0, 0, 65' },
  { id: 'night', hex: '#0C0A09', rgb: '12, 10, 9', cmyk: '0, 17, 25, 95' },
  { id: 'white', hex: '#FFFFFF', rgb: '255, 255, 255', cmyk: '0, 0, 0, 0' },
] as const

const DONTS: Array<{ id: string; style?: CSSProperties }> = [
  { id: 'stretch', style: { transform: 'scale(1.5, 0.7)' } },
  { id: 'rotate', style: { transform: 'rotate(-18deg)' } },
  { id: 'recolor', style: { filter: 'hue-rotate(185deg) saturate(1.6)' } },
  {
    id: 'effects',
    style: { filter: 'drop-shadow(0 0 6px #F59E0B) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.9))' },
  },
  { id: 'contrast', style: { opacity: 0.25 } },
  { id: 'retype' },
]

const PRODUCT_IMAGES = [
  { id: 'banners', preview: '/brand/previews/banners.webp', width: 800, height: 320 },
  { id: 'wallet', preview: '/brand/previews/ssp-wallet.webp', width: 800, height: 500 },
  { id: 'key', preview: '/brand/previews/ssp-key.webp', width: 400, height: 867 },
] as const

const PRODUCT_IMAGE_FOLDERS: Record<(typeof PRODUCT_IMAGES)[number]['id'], string> = {
  banners: 'banners',
  wallet: 'ssp-wallet',
  key: 'ssp-key',
}

function FileLink({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <a
      href={href}
      download
      aria-label={ariaLabel}
      className='hover:border-primary-500 hover:text-primary-700 dark:border-dark-600 dark:bg-dark-700 dark:hover:border-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors dark:text-gray-200'
    >
      <ArrowDownToLine className='h-3.5 w-3.5' />
      {label}
    </a>
  )
}

function Section({
  id,
  title,
  description,
  muted = false,
  children,
}: {
  id: (typeof SECTIONS)[number]
  title: string
  description?: string
  muted?: boolean
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={`section-padding dark:bg-dark-900 scroll-mt-16 md:scroll-mt-20 ${muted ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className='container-custom'>
        <div className='mb-10 max-w-3xl'>
          <h2 className='mb-4'>{title}</h2>
          {description && <p className='text-lg text-gray-600 dark:text-gray-400'>{description}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

const cardClass =
  'dark:border-dark-600 dark:bg-dark-800 overflow-hidden rounded-2xl border border-gray-200 bg-white'

export async function BrandContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Brand' })
  const fileLabel = (file: string) => t('downloadFile', { file })
  const bold = (chunks: ReactNode) => (
    <strong className='font-semibold text-gray-900 dark:text-white'>{chunks}</strong>
  )

  const clearSpaceLogoWidth = 280
  const x = Math.round(clearSpaceLogoWidth * PILLAR_WIDTH_OF_LOGO)

  const contactText = t('legal.contact', { email: CONTACT_EMAIL })
  const [contactBefore, contactAfter = ''] = contactText.split(CONTACT_EMAIL)

  return (
    <>
      {/* Hero */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl text-center'>
            <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
              <Palette className='mr-2 h-4 w-4' />
              {t('heroBadge')}
            </div>
            <h1 className='mb-6'>{t('heroTitle')}</h1>
            <p className='mx-auto mb-10 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescription')}
            </p>
            <div className='flex flex-col justify-center gap-3 sm:flex-row'>
              <a href={KIT_ZIP} className='btn btn-primary hover:text-white'>
                <Download className='mr-2 h-5 w-5' />
                {t('downloadAll')}
              </a>
              <a
                href={KIT_REPO}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-secondary hover:text-gray-900 dark:hover:text-white'
              >
                <Github className='mr-2 h-5 w-5' />
                {t('viewOnGithub')}
              </a>
            </div>
            <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>{t('svgNote')}</p>
          </div>

          <div className='border-primary-200 bg-primary-50 dark:border-primary-900/50 dark:bg-primary-950/30 mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-2xl border p-6 sm:flex-row'>
            <Image
              src='/brand/icon/ssp-icon-circle-amber.svg'
              alt=''
              width={64}
              height={64}
              className='h-16 w-16 shrink-0'
            />
            <div className='flex-1 text-center sm:text-left'>
              <p className='font-semibold text-gray-900 dark:text-white'>{t('quickPick.title')}</p>
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                {t('quickPick.description')}
              </p>
            </div>
            <div className='flex shrink-0 flex-wrap justify-center gap-2'>
              <FileLink
                href='/brand/icon/ssp-icon-circle-amber.svg'
                label='SVG'
                ariaLabel={fileLabel('ssp-icon-circle-amber.svg')}
              />
              <FileLink
                href='/brand/icon/ssp-icon-circle-amber-256.png'
                label='PNG 256'
                ariaLabel={fileLabel('ssp-icon-circle-amber-256.png')}
              />
            </div>
          </div>

          <nav
            aria-label={t('nav.label')}
            className='mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-2'
          >
            {SECTIONS.map(id => (
              <a
                key={id}
                href={`#${id}`}
                className='hover:border-primary-400 hover:text-primary-700 dark:border-dark-600 dark:hover:border-primary-400 dark:hover:text-primary-300 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors dark:text-gray-300'
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Logo */}
      <Section id='logo' title={t('logo.title')} description={t('logo.description')} muted>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {VARIANTS.map(v => {
            const base = `ssp-logo-${v.file}`
            return (
              <div key={v.id} className={cardClass}>
                <div className={`flex h-40 items-center justify-center ${v.preview}`}>
                  <Image
                    src={`/brand/logo/${base}.svg`}
                    alt={`${t('logo.title')}: ${t(`variants.${v.id}.name`)}`}
                    width={588}
                    height={224}
                    className='h-14 w-auto'
                  />
                </div>
                <div className='p-5'>
                  <h3 className='text-base text-gray-900 dark:text-white'>
                    {t(`variants.${v.id}.name`)}
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {t(`variants.${v.id}.use`)}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <FileLink
                      href={`/brand/logo/${base}.svg`}
                      label='SVG'
                      ariaLabel={fileLabel(`${base}.svg`)}
                    />
                    <FileLink
                      href={`/brand/logo/${base}.png`}
                      label='PNG'
                      ariaLabel={fileLabel(`${base}.png`)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className='mt-6 text-sm text-gray-500 dark:text-gray-400'>{t('logo.pngNote')}</p>
      </Section>

      {/* Symbol */}
      <Section id='symbol' title={t('symbol.title')} description={t('symbol.description')}>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {VARIANTS.map(v => {
            const base = `ssp-symbol-${v.file}`
            return (
              <div key={v.id} className={cardClass}>
                <div className={`flex h-40 items-center justify-center ${v.preview}`}>
                  <Image
                    src={`/brand/symbol/${base}.svg`}
                    alt={`${t('symbol.title')}: ${t(`variants.${v.id}.name`)}`}
                    width={184}
                    height={240}
                    className='h-20 w-auto'
                  />
                </div>
                <div className='p-5'>
                  <h3 className='text-base text-gray-900 dark:text-white'>
                    {t(`variants.${v.id}.name`)}
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {t(`variants.${v.id}.use`)}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <FileLink
                      href={`/brand/symbol/${base}.svg`}
                      label='SVG'
                      ariaLabel={fileLabel(`${base}.svg`)}
                    />
                    <FileLink
                      href={`/brand/symbol/${base}.png`}
                      label='PNG'
                      ariaLabel={fileLabel(`${base}.png`)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className='mt-6 text-sm text-gray-500 dark:text-gray-400'>{t('symbol.pngNote')}</p>
      </Section>

      {/* Icon */}
      <Section id='icon' title={t('icon.title')} description={t('icon.description')} muted>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {ICON_SHAPES.flatMap(shape =>
            ICON_TONES.map(tone => {
              const base = `ssp-icon-${shape}-${tone}`
              const recommended = shape === 'circle' && tone === 'amber'
              return (
                <div
                  key={base}
                  className={`${cardClass} ${recommended ? 'ring-primary-400 ring-2' : ''}`}
                >
                  <div className='dark:bg-dark-700 relative flex h-40 items-center justify-center bg-gray-100'>
                    {recommended && (
                      <span className='bg-primary-400 absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold text-black'>
                        {t('icon.recommended')}
                      </span>
                    )}
                    <Image
                      src={`/brand/icon/${base}.svg`}
                      alt={`${t('icon.title')}: ${t(`icon.${shape}`)}, ${t(`icon.${tone}`)}`}
                      width={96}
                      height={96}
                      className='h-24 w-24'
                    />
                  </div>
                  <div className='p-5'>
                    <h3 className='text-base text-gray-900 dark:text-white'>
                      {t(`icon.${shape}`)} · {t(`icon.${tone}`)}
                    </h3>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      <FileLink
                        href={`/brand/icon/${base}.svg`}
                        label='SVG'
                        ariaLabel={fileLabel(`${base}.svg`)}
                      />
                      <FileLink
                        href={`/brand/icon/${base}.png`}
                        label='PNG 1024'
                        ariaLabel={fileLabel(`${base}.png`)}
                      />
                      <FileLink
                        href={`/brand/icon/${base}-256.png`}
                        label='PNG 256'
                        ariaLabel={fileLabel(`${base}-256.png`)}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className={`${cardClass} mt-6 flex flex-col items-center gap-5 p-6 sm:flex-row`}>
          <Image
            src='/brand/icon/ssp-key-app-icon-512.png'
            alt={t('icon.keyAppTitle')}
            width={72}
            height={72}
            className='h-18 w-18 shrink-0 rounded-2xl'
          />
          <div className='flex-1 text-center sm:text-left'>
            <h3 className='text-base text-gray-900 dark:text-white'>{t('icon.keyAppTitle')}</h3>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              {t('icon.keyAppDescription')}
            </p>
          </div>
          <FileLink
            href='/brand/icon/ssp-key-app-icon-512.png'
            label='PNG 512'
            ariaLabel={fileLabel('ssp-key-app-icon-512.png')}
          />
        </div>
      </Section>

      {/* Colors */}
      <Section id='colors' title={t('colors.title')} description={t('colors.description')}>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {COLORS.map(color => (
            <div key={color.id} className={cardClass}>
              <div
                className={`h-28 ${
                  color.id === 'white'
                    ? 'dark:border-dark-600 border-b border-gray-200'
                    : color.id === 'night'
                      ? 'dark:border-dark-600 dark:border-b'
                      : ''
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <div className='p-4'>
                <h3 className='px-2 text-base text-gray-900 dark:text-white'>
                  {t(`colors.items.${color.id}.name`)}
                </h3>
                <p className='mt-1 mb-3 px-2 text-sm text-gray-600 dark:text-gray-400'>
                  {t(`colors.items.${color.id}.use`)}
                </p>
                {(['hex', 'rgb', 'cmyk'] as const).map(format => (
                  <CopyValue
                    key={format}
                    label={format}
                    value={color[format]}
                    copyLabel={t('colors.copy', { value: color[format] })}
                    copiedLabel={t('colors.copied')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`${cardClass} mt-6 flex flex-col items-center gap-5 p-6 sm:flex-row`}>
          <div className='flex shrink-0 gap-3'>
            <div className='font-display relative flex h-14 w-20 items-center justify-center rounded-lg bg-[#FBBF24] text-xl font-extrabold text-black'>
              Aa
              <Check className='absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 p-0.5 text-white' />
            </div>
            <div className='font-display relative flex h-14 w-20 items-center justify-center rounded-lg bg-[#FBBF24] text-xl font-extrabold text-white'>
              Aa
              <X className='absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 p-0.5 text-white' />
            </div>
          </div>
          <p className='text-center font-medium text-gray-900 sm:text-left dark:text-white'>
            {t('colors.amberRule')}
          </p>
        </div>
      </Section>

      {/* Typography */}
      <Section
        id='typography'
        title={t('typography.title')}
        description={t('typography.description')}
        muted
      >
        <div className='grid gap-6 lg:grid-cols-2'>
          {(
            [
              {
                id: 'display',
                name: 'Montserrat',
                weights: '600 · 700 · 800',
                font: 'font-display',
                sampleClass: 'text-3xl font-extrabold',
                href: 'https://fonts.google.com/specimen/Montserrat',
              },
              {
                id: 'body',
                name: 'Inter',
                weights: '400 · 500 · 600 · 700',
                font: 'font-sans',
                sampleClass: 'text-lg',
                href: 'https://fonts.google.com/specimen/Inter',
              },
            ] as const
          ).map(face => (
            <div key={face.id} className={`${cardClass} flex flex-col p-6`}>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h3 className={`text-2xl text-gray-900 dark:text-white ${face.font}`}>
                    {face.name}
                  </h3>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {t(`typography.${face.id}Role`)} ·{' '}
                    {t('typography.weights', { weights: face.weights })}
                  </p>
                </div>
                <span
                  className={`text-5xl leading-none font-bold text-gray-900 dark:text-white ${face.font}`}
                  aria-hidden='true'
                >
                  Aa
                </span>
              </div>
              <p
                className={`mt-6 flex-1 text-gray-900 dark:text-gray-100 ${face.font} ${face.sampleClass}`}
              >
                {face.id === 'display' ? t('typography.displaySample') : t('typography.bodySample')}
              </p>
              <a
                href={face.href}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-6 inline-flex items-center gap-1.5 text-sm font-semibold'
              >
                {t('typography.getFont')}
                <ExternalLink className='h-3.5 w-3.5' />
              </a>
            </div>
          ))}
        </div>
        <p className='mt-6 max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          {t('typography.license')}
        </p>
      </Section>

      {/* Usage */}
      <Section id='usage' title={t('usage.title')}>
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className={`${cardClass} flex flex-col`}>
            <div className='flex flex-1 items-center justify-center bg-[#0C0A09] px-4 py-10'>
              <div
                className='border-primary-400/70 relative border border-dashed'
                style={{ padding: x }}
              >
                {[
                  'top-0 left-1/2 -translate-x-1/2',
                  'bottom-0 left-1/2 -translate-x-1/2',
                  'top-1/2 left-0 -translate-y-1/2',
                  'top-1/2 right-0 -translate-y-1/2',
                ].map(position => (
                  <span
                    key={position}
                    className={`bg-primary-400/25 text-primary-300 absolute flex items-center justify-center font-mono text-xs ${position}`}
                    style={{ width: x, height: x }}
                    aria-hidden='true'
                  >
                    x
                  </span>
                ))}
                <Image
                  src='/brand/logo/ssp-logo-on-dark.svg'
                  alt=''
                  width={588}
                  height={224}
                  className='block h-auto max-w-full outline-1 outline-white/25 outline-dashed'
                  style={{ width: clearSpaceLogoWidth }}
                />
              </div>
            </div>
            <div className='p-6'>
              <h3 className='text-lg text-gray-900 dark:text-white'>
                {t('usage.clearSpaceTitle')}
              </h3>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                {t('usage.clearSpaceText')}
              </p>
            </div>
          </div>

          <div className={`${cardClass} flex flex-col`}>
            <div className='grid flex-1 grid-cols-3 items-end gap-4 bg-[#0C0A09] px-6 py-10'>
              {(
                [
                  {
                    id: 'logo',
                    src: '/brand/logo/ssp-logo-on-dark.svg',
                    w: 96,
                    h: 96 / LOGO_ASPECT,
                    digital: t('usage.wide', { size: '96 px' }),
                    print: t('usage.wide', { size: '25 mm' }),
                  },
                  {
                    id: 'symbol',
                    src: '/brand/symbol/ssp-symbol-on-dark.svg',
                    w: 16 * SYMBOL_ASPECT,
                    h: 16,
                    digital: t('usage.tall', { size: '16 px' }),
                    print: t('usage.tall', { size: '5 mm' }),
                  },
                  {
                    id: 'icon',
                    src: '/brand/icon/ssp-icon-circle-amber.svg',
                    w: 24,
                    h: 24,
                    digital: '24 px',
                    print: '8 mm',
                  },
                ] as const
              ).map(item => (
                <div key={item.id} className='flex flex-col items-center gap-3 text-center'>
                  <div className='flex h-10 items-end justify-center'>
                    <Image
                      src={item.src}
                      alt=''
                      width={Math.round(item.w)}
                      height={Math.round(item.h)}
                      style={{ width: item.w, height: item.h }}
                    />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-white'>{t(`usage.${item.id}`)}</p>
                    <p className='mt-1 text-xs text-gray-400'>
                      {t('usage.digital')}: {item.digital}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {t('usage.print')}: {item.print}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='p-6'>
              <h3 className='text-lg text-gray-900 dark:text-white'>{t('usage.minSizeTitle')}</h3>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                {t('usage.minSizeText')}
              </p>
            </div>
          </div>
        </div>

        <h3 className='mt-16 mb-6 text-2xl text-gray-900 dark:text-white'>{t('usage.dosTitle')}</h3>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <div className={cardClass}>
            <div className='flex h-32 items-center justify-center bg-[#0C0A09]'>
              <Image
                src='/brand/logo/ssp-logo-on-dark.svg'
                alt=''
                width={588}
                height={224}
                className='h-12 w-auto'
              />
            </div>
            <UsageCaption ok label={t('usage.do')} text={t('usage.dos.onDark')} />
          </div>
          <div className={cardClass}>
            <div className='flex h-32 items-center justify-center bg-[#FBBF24]'>
              <Image
                src='/brand/logo/ssp-logo-black.svg'
                alt=''
                width={588}
                height={224}
                className='h-12 w-auto'
              />
            </div>
            <UsageCaption ok label={t('usage.do')} text={t('usage.dos.onAmber')} />
          </div>
          {DONTS.map(dont => (
            <div key={dont.id} className={cardClass}>
              <div className='flex h-32 items-center justify-center overflow-hidden bg-[#0C0A09]'>
                {dont.id === 'retype' ? (
                  <div className='flex items-center gap-2'>
                    <Image
                      src='/brand/symbol/ssp-symbol-on-dark.svg'
                      alt=''
                      width={184}
                      height={240}
                      className='h-12 w-auto'
                    />
                    <span className='font-serif text-4xl text-white'>SSP</span>
                  </div>
                ) : (
                  <Image
                    src='/brand/logo/ssp-logo-on-dark.svg'
                    alt=''
                    width={588}
                    height={224}
                    className='h-12 w-auto'
                    style={dont.style}
                  />
                )}
              </div>
              <UsageCaption label={t('usage.dont')} text={t(`usage.donts.${dont.id}`)} />
            </div>
          ))}
        </div>
        <p className='mt-6 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400'>
          <X className='mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400' />
          {t('usage.lowRes')}
        </p>
      </Section>

      {/* Writing the name */}
      <Section id='name' title={t('name.title')} muted>
        <div className='grid gap-6 lg:grid-cols-2'>
          <ul className={`${cardClass} space-y-4 p-6`}>
            {(['capitals', 'products'] as const).map(rule => (
              <li key={rule} className='flex items-start gap-3'>
                <Check className='mt-1 h-5 w-5 shrink-0 text-green-600 dark:text-green-400' />
                <span className='text-gray-700 dark:text-gray-300'>
                  {t.rich(`name.${rule}`, { b: bold })}
                </span>
              </li>
            ))}
          </ul>
          <div className='grid gap-6'>
            <div className={`${cardClass} p-6`}>
              <p className='text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                {t('name.taglineLabel')}
              </p>
              <p className='font-display mt-2 text-2xl font-bold text-gray-900 dark:text-white'>
                {TAGLINE}
              </p>
            </div>
            <div className={`${cardClass} p-6`}>
              <p className='text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400'>
                {t('name.oneLinerLabel')}
              </p>
              <p className='mt-2 text-lg text-gray-900 dark:text-white'>{t('name.oneLiner')}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Product images */}
      <Section id='images' title={t('images.title')} description={t('images.description')}>
        <div className='grid gap-6 md:grid-cols-3'>
          {PRODUCT_IMAGES.map(image => (
            <div key={image.id} className={`${cardClass} flex flex-col`}>
              <div className='dark:bg-dark-700 flex h-48 items-center justify-center overflow-hidden bg-gray-100 p-4'>
                <Image
                  src={image.preview}
                  alt={t(`images.${image.id}.title`)}
                  width={image.width}
                  height={image.height}
                  className='h-full w-auto rounded-md object-contain shadow-md'
                />
              </div>
              <div className='flex flex-1 flex-col p-5'>
                <h3 className='text-base text-gray-900 dark:text-white'>
                  {t(`images.${image.id}.title`)}
                </h3>
                <p className='mt-1 flex-1 text-sm text-gray-600 dark:text-gray-400'>
                  {t(`images.${image.id}.description`)}
                </p>
                <a
                  href={`${KIT_REPO}/tree/master/images/${PRODUCT_IMAGE_FOLDERS[image.id]}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold'
                >
                  {t('images.browse')}
                  <ExternalLink className='h-3.5 w-3.5' />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Legal */}
      <Section id='legal' title={t('legal.title')} muted>
        <div className='max-w-3xl space-y-4 text-gray-600 dark:text-gray-400'>
          <p>{t('legal.trademark')}</p>
          <p>{t('legal.restrictions')}</p>
          <p>{t('legal.notOpenSource')}</p>
        </div>
        <div className={`${cardClass} mt-10 flex max-w-3xl items-start gap-4 p-6`}>
          <div className='bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
            <Mail className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-base text-gray-900 dark:text-white'>{t('legal.contactTitle')}</h3>
            <p className='mt-1 text-gray-600 dark:text-gray-400'>
              {contactBefore}
              <a href={`mailto:${CONTACT_EMAIL}`} className='font-semibold'>
                {CONTACT_EMAIL}
              </a>
              {contactAfter}
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}

function UsageCaption({ ok = false, label, text }: { ok?: boolean; label: string; text: string }) {
  return (
    <div className='p-4'>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
          ok
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
        }`}
      >
        {ok ? <Check className='h-3 w-3' /> : <X className='h-3 w-3' />}
        {label}
      </span>
      <p className='mt-2 text-sm text-gray-700 dark:text-gray-300'>{text}</p>
    </div>
  )
}
