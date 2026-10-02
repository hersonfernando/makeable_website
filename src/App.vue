<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import Brand from './components/Brand.vue'
import Icon from './components/Icon.vue'
import InfrastructureArt from './components/InfrastructureArt.vue'

const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Our approach', href: '#approach' },
  { label: 'About us', href: '#about' },
]
const services = [
  {
    id: 'cloud', number: '01', icon: 'cloud', title: 'Cloud solutions',
    description: 'A smarter foundation for your business. Flexible, reliable cloud infrastructure that grows with you.',
    tags: 'ARCHITECTURE · MIGRATION · MANAGEMENT',
    detail: 'Whether you are moving your first workload or improving an existing environment, we help you make confident cloud decisions. We design around your operations, your budget, and the way your business will grow.',
    capabilities: ['Cloud readiness and architecture planning', 'Workload migration and deployment', 'Backup, recovery, and continuity planning', 'Monitoring and cost optimization'],
    outcome: 'A clear path to a cloud environment your team can depend on.',
  },
  {
    id: 'network', number: '02', icon: 'network', title: 'Network infrastructure',
    description: 'Keep your people and systems connected with thoughtfully designed, dependable networks.',
    tags: 'DESIGN · CONNECTIVITY · SECURITY',
    detail: 'Strong connections start with thoughtful planning. We map your spaces, understand your usage, and design a network that supports everyday work, whether your team is in one office or across multiple locations.',
    capabilities: ['Network assessment and layout design', 'Structured cabling and wireless planning', 'Routing, switching, and segmentation', 'Network documentation and troubleshooting'],
    outcome: 'A practical, documented network built for the way your team works.',
  },
  {
    id: 'consulting', number: '03', icon: 'consulting', title: 'IT consulting',
    description: 'Make the right technology decisions with a partner who sees the bigger picture.',
    tags: 'STRATEGY · AUDIT · ROADMAP',
    detail: 'Technology should serve your goals. We turn complicated choices into understandable recommendations, help you prioritize what matters, and build a realistic plan for moving your business forward.',
    capabilities: ['Technology and infrastructure assessments', 'IT strategy and investment planning', 'Software and vendor evaluation', 'Implementation guidance and team support'],
    outcome: 'An actionable technology roadmap with clear priorities.',
  },
  {
    id: 'systems', number: '04', icon: 'code', title: 'Information systems',
    description: 'Less friction. More possibility. Custom software built around how your business actually works.',
    tags: 'CUSTOM SOFTWARE · INTEGRATION · AUTOMATION',
    detail: 'We turn disconnected tasks and spreadsheets into connected workflows. From internal tools to complete business platforms, we design and develop systems that are intuitive for your people and useful from day one.',
    capabilities: ['Requirements discovery and workflow mapping', 'Custom web applications and business systems', 'API integrations and workflow automation', 'Testing, training, and ongoing improvements'],
    outcome: 'Software that fits your business, with a plan for continued improvement.',
  },
]
const filters = ['All possibilities', 'Infrastructure', 'Business systems']
const selectedFilter = ref(filters[0])
const solutions = [
  { id: 'workplace', category: 'Infrastructure', label: 'CONNECTED WORKPLACES', title: 'Bring your team together.', description: 'Connected offices. Reliable access. A network that keeps up with your people.', service: 'network', visual: 'network' },
  { id: 'operations', category: 'Business systems', label: 'SMARTER OPERATIONS', title: 'Make everyday work flow.', description: 'Turn manual processes into simple, connected business systems.', service: 'systems', visual: 'dashboard' },
  { id: 'growth', category: 'Infrastructure', label: 'ROOM TO GROW', title: 'Build for your next chapter.', description: 'Move your business forward with a flexible, thoughtfully planned cloud foundation.', service: 'cloud', visual: 'cloud' },
]
const visibleSolutions = computed(() => solutions.filter(solution => selectedFilter.value === filters[0] || solution.category === selectedFilter.value))
const process = [
  { number: '01', title: 'Understand first.', description: 'We ask questions, listen closely, and get to know your business. Your goals shape the plan.' },
  { number: '02', title: 'Build with purpose.', description: 'We design the right solution, keep you involved, and bring it to life with care and clarity.' },
  { number: '03', title: 'Move forward, together.', description: 'We help your team get comfortable, document the essentials, and support what comes next.' },
]

const menuOpen = ref(false)
const dialogRef = ref(null)
const dialogContent = ref(null)
const emailPrepared = ref(false)
const copyStatus = ref('')
const form = ref({ name: '', email: '', company: '', service: '', message: '' })
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'hello@makeable.io'
let previousFocus = null

function closeMenu() { menuOpen.value = false }

async function showDialog(content) {
  closeMenu()
  if (!dialogRef.value.open) previousFocus = document.activeElement
  dialogContent.value = content
  emailPrepared.value = false
  copyStatus.value = ''
  await nextTick()
  if (!dialogRef.value.open) dialogRef.value.showModal()
  document.body.style.overflow = 'hidden'
  dialogRef.value.querySelector(content.kind === 'inquiry' ? 'input' : '.dialog-close')?.focus()
}

function openService(service) { showDialog({ kind: 'service', service }) }
function openInquiry(service = '') {
  if (service) form.value.service = service
  showDialog({ kind: 'inquiry' })
}
function closeDialog() { dialogRef.value.close() }
function onDialogClosed() {
  document.body.style.overflow = ''
  dialogContent.value = null
  previousFocus?.focus()
}
function onBackdropClick(event) {
  if (event.target !== dialogRef.value) return
  const bounds = dialogRef.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog()
}
const projectBrief = computed(() => [
  `Hi Makeable.IO Information Technology Solutions,`, '', 'I would like to discuss a project.', '',
  `Name: ${form.value.name.trim()}`, `Email: ${form.value.email.trim()}`,
  ...(form.value.company.trim() ? [`Company: ${form.value.company.trim()}`] : []),
  `Interested in: ${services.find(service => service.id === form.value.service)?.title || 'Help choosing the right solution'}`,
  '', 'Project brief:', form.value.message.trim(),
].join('\n'))
const emailLink = computed(() => `mailto:${contactEmail}?subject=${encodeURIComponent(`Project inquiry${form.value.company.trim() ? ` — ${form.value.company.trim()}` : ''}`)}&body=${encodeURIComponent(projectBrief.value)}`)
function prepareEmail(event) {
  if (form.value.message.trim().length < 15) {
    const messageField = event.target.elements.message
    messageField.setCustomValidity('Please describe your project in at least 15 characters.')
    messageField.reportValidity()
    return
  }
  window.location.href = emailLink.value
  emailPrepared.value = true
}
async function copyBrief() {
  try {
    await navigator.clipboard.writeText(projectBrief.value)
    copyStatus.value = 'Project brief copied.'
  } catch {
    copyStatus.value = 'Select and copy the project brief below.'
  }
}
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" @keydown.esc="closeMenu">
    <div class="container header-inner">
      <a class="brand-link" href="#" aria-label="Makeable.IO Information Technology Solutions home" @click="closeMenu"><Brand /><span class="brand-name"><strong>Makeable.IO</strong> <span>Information Technology Solutions</span></span></a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a v-for="item in navigation" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>
      <button class="button button-small header-cta" @click="openInquiry()">Let’s talk <Icon name="arrow-up" :size="17" /></button>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-controls="mobile-navigation" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" @click="menuOpen = !menuOpen"><Icon :name="menuOpen ? 'close' : 'menu'" /></button>
    </div>
    <nav v-if="menuOpen" id="mobile-navigation" class="mobile-nav" aria-label="Mobile navigation" @keydown.esc="closeMenu">
      <a v-for="item in navigation" :key="item.href" :href="item.href" @click="closeMenu">{{ item.label }}<Icon name="arrow-up" :size="18" /></a>
      <button @click="openInquiry()">Let’s talk <Icon name="arrow-up" :size="18" /></button>
    </nav>
  </header>

  <main id="main">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="eyebrow"><span class="tiny-square"></span> YOUR NEXT TECHNOLOGY PARTNER</div>
          <h1>Great ideas.<br /><span>Made possible.</span></h1>
          <p class="hero-description">We connect the dots between your business and better technology. From cloud to custom systems, let’s make your next move possible.</p>
          <div class="hero-actions">
            <button class="button" @click="openInquiry()">Let’s build something <Icon name="arrow-up" :size="19" /></button>
            <a class="text-link" href="#services">Explore our services <Icon name="down" :size="17" /></a>
          </div>
          <div class="hero-note"><span class="availability-dot"></span> Big-picture thinking. Hands-on building.</div>
        </div>
        <InfrastructureArt />
      </div>
      <div class="container hero-footnote"><span>GOOD TECHNOLOGY. GREATER POSSIBILITIES.</span><span class="scroll-note">A little more about what we do <Icon name="down" :size="14" /></span></div>
    </section>

    <div class="expertise-strip" aria-label="Our expertise">
      <div class="container expertise-inner">
        <span class="strip-intro">The right pieces.<br /><strong>Working together.</strong></span>
        <a v-for="service in services" :key="service.id" href="#services"><Icon :name="service.icon" :size="23" /><span>{{ service.title }}</span></a>
      </div>
    </div>

    <section id="services" class="section services-section">
      <div class="container">
        <div class="section-heading">
          <div><div class="eyebrow"><span class="tiny-square"></span> WHAT WE DO</div><h2>Technology that works.<br />For you.</h2></div>
          <p>Complex challenges. Clear solutions. <br />We bring the right expertise to help your<br class="desktop-break" /> business move forward.</p>
        </div>
        <div class="services-grid">
          <button v-for="service in services" :key="service.id" class="service-card" @click="openService(service)" :aria-label="`Explore ${service.title}`">
            <div class="service-card-top"><span class="service-icon"><Icon :name="service.icon" :size="28" /></span><span class="card-number">{{ service.number }}</span></div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <div class="service-card-bottom"><span>Let’s explore <Icon name="arrow" :size="17" /></span></div>
          </button>
        </div>
        <div class="services-note"><Icon name="spark" :size="18" /><p>One partner. A connected approach. <span>Because your technology should work together, too.</span></p></div>
      </div>
    </section>

    <section id="possibilities" class="section possibilities-section">
      <div class="container">
        <div class="section-heading">
          <div><div class="eyebrow"><span class="tiny-square"></span> WHAT’S POSSIBLE</div><h2>Built around<br />how you work.</h2></div>
          <p>Your business is one of a kind. <br />Your technology should feel that way. <br />Here’s where we can take you.</p>
        </div>
        <div class="solution-filters" role="group" aria-label="Filter solutions">
          <button v-for="filter in filters" :key="filter" :class="{ selected: selectedFilter === filter }" :aria-pressed="selectedFilter === filter" @click="selectedFilter = filter">{{ filter }}</button>
        </div>
        <div class="solutions-grid" aria-live="polite" aria-atomic="true">
          <button v-for="solution in visibleSolutions" :key="solution.id" class="solution-card" @click="openService(services.find(service => service.id === solution.service))">
            <div class="solution-art" :class="`solution-art-${solution.visual}`" aria-hidden="true">
              <template v-if="solution.visual === 'network'">
                <div class="network-orbit orbit-one"></div><div class="network-orbit orbit-two"></div>
                <svg class="network-lines" viewBox="0 0 360 218"><path d="M180 109 86 55M180 109l100-43M180 109l-73 60M180 109l90 54" fill="none" stroke="#b6b5e9" stroke-width="1.5" stroke-dasharray="5 4" /></svg>
                <div class="network-hub"><Brand /></div><span class="network-point point-one"><Icon name="code" :size="19" /></span><span class="network-point point-two"><Icon name="cloud" :size="21" /></span><span class="network-point point-three"><Icon name="network" :size="20" /></span><span class="network-point point-four"><Icon name="globe" :size="20" /></span>
                <div class="mini-status"><span class="status-dot"></span> All connected</div>
              </template>
              <template v-else-if="solution.visual === 'dashboard'">
                <div class="mini-dashboard"><div class="mini-sidebar"><span class="mini-logo">m.</span><i></i><i class="active"></i><i></i><i></i></div><div class="mini-main"><div class="mini-top"><span>Business overview</span><span class="mini-avatar">M</span></div><div class="mini-stats"><div><span>Projects</span><b>24</b></div><div><span>Tasks complete</span><b>86<span>%</span></b></div></div><div class="mini-chart"><span>This week</span><div class="chart-bars"><i style="--bar: 36%"></i><i style="--bar: 57%"></i><i style="--bar: 43%"></i><i style="--bar: 74%"></i><i style="--bar: 63%"></i><i style="--bar: 89%"></i><i style="--bar: 78%"></i></div></div></div></div>
                <div class="automation-badge"><span class="check-circle"><Icon name="check" :size="11" /></span> Workflow, simplified.</div>
              </template>
              <template v-else>
                <div class="cloud-orbit"></div><div class="cloud-symbol"><Icon name="cloud" :size="66" /></div><div class="server-stack"><div><span></span><span></span><span></span><i></i></div><div><span></span><span></span><span></span><i></i></div><div><span></span><span></span><span></span><i></i></div></div><span class="cloud-badge"><Icon name="arrow-up" :size="14" /> Ready to scale</span>
              </template>
            </div>
            <div class="solution-info"><span class="eyebrow">{{ solution.label }}</span><h3>{{ solution.title }}</h3><p>{{ solution.description }}</p><span class="solution-arrow"><Icon name="arrow-up" :size="19" /></span></div>
          </button>
        </div>
      </div>
    </section>

    <section id="approach" class="section approach-section">
      <div class="container">
        <div class="section-heading">
          <div><div class="eyebrow"><span class="tiny-square"></span> HOW WE WORK</div><h2>Good things start<br />with a conversation.</h2></div>
          <p>No complicated handoffs. <br />No unnecessary jargon. <br />Just a team invested in your next step.</p>
        </div>
        <div class="process-grid">
          <div v-for="step in process" :key="step.number" class="process-step"><div class="process-top"><span>{{ step.number }}</span><div class="process-line"></div><Icon name="arrow" :size="18" /></div><h3>{{ step.title }}</h3><p>{{ step.description }}</p></div>
        </div>
      </div>
    </section>

    <section id="about" class="about-section">
      <div class="container about-grid">
        <div class="about-art" aria-hidden="true"><div class="about-grid-pattern"></div><div class="about-stamp"><Icon name="spark" :size="44" /><span>THINK BIG.<br />MAKE IT HAPPEN.</span></div><Brand class="about-logo" /><div class="about-art-bottom"><span>A LITTLE CURIOSITY.<br />A LOT OF POSSIBILITY.</span><Icon name="arrow-up" :size="34" /></div></div>
        <div class="about-copy"><div class="eyebrow"><span class="tiny-square"></span> HELLO, WE’RE MAKEABLE.IO</div><h2>Small team.<br />Big possibilities.</h2><p>We’re Makeable.IO Information Technology Solutions, a technology startup with a simple belief: the right technology can make a real difference.</p><p>We bring cloud, networks, consulting, and software development together under one roof. Curious by nature and practical by design, we’re here to help you solve today’s challenges and build for tomorrow.</p><a class="text-link" href="#contact">Meet your next technology partner <Icon name="arrow-up" :size="18" /></a></div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="container contact-inner"><div><div class="eyebrow"><span class="tiny-square"></span> YOUR NEXT CHAPTER STARTS HERE</div><h2>Have something in mind?<br />Let’s make it <span>possible.</span></h2><p>An idea, a challenge, or just a question. We’d love to hear it.</p></div><button class="button button-light" @click="openInquiry()">Let’s talk about it <Icon name="arrow-up" :size="20" /></button><div class="contact-decoration" aria-hidden="true">↗</div></div>
    </section>
  </main>

  <footer class="site-footer"><div class="container"><div class="footer-top"><a href="#" aria-label="Makeable.IO Information Technology Solutions home"><Brand /></a><p>Thoughtful technology.<br />Made for what’s next.</p><div class="footer-links"><a href="#services">Our services</a><a href="#approach">Our approach</a><button @click="openInquiry()">Get in touch <Icon name="arrow-up" :size="14" /></button></div></div><div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Makeable.IO Information Technology Solutions. All rights reserved.</span><span>Great ideas. Made possible. <span class="footer-dot"></span></span><a href="#" class="back-top">Back to top <span aria-hidden="true">↑</span></a></div></div></footer>

  <dialog ref="dialogRef" class="site-dialog" :aria-labelledby="dialogContent?.kind === 'service' ? 'service-dialog-title' : 'inquiry-dialog-title'" @click="onBackdropClick" @close="onDialogClosed">
    <button class="dialog-close" aria-label="Close dialog" @click="closeDialog"><Icon name="close" :size="21" /></button>
    <template v-if="dialogContent?.kind === 'service'">
      <div class="dialog-eyebrow"><span class="service-icon"><Icon :name="dialogContent.service.icon" :size="27" /></span><span class="eyebrow">{{ dialogContent.service.tags }}</span></div>
      <h2 id="service-dialog-title">{{ dialogContent.service.title }}</h2><p class="dialog-description">{{ dialogContent.service.detail }}</p>
      <h3 class="capabilities-title">How we can help</h3><ul class="capabilities"><li v-for="capability in dialogContent.service.capabilities" :key="capability"><Icon name="check" :size="17" />{{ capability }}</li></ul>
      <div class="outcome"><Icon name="spark" :size="21" /><p>{{ dialogContent.service.outcome }}</p></div><button class="button dialog-cta" @click="openInquiry(dialogContent.service.id)">Let’s talk about your project <Icon name="arrow-up" :size="19" /></button>
    </template>
    <template v-else-if="dialogContent?.kind === 'inquiry'">
      <div class="eyebrow"><span class="tiny-square"></span> LET’S BUILD SOMETHING</div><h2 id="inquiry-dialog-title">What do you have in mind?</h2><p class="dialog-description">Tell us a little about yourself and your idea. Big or small, we’re ready to explore it with you.</p>
      <form v-if="!emailPrepared" class="inquiry-form" @submit.prevent="prepareEmail">
        <div class="form-row"><label>Your name <span>*</span><input v-model="form.name" name="name" autocomplete="name" placeholder="Alex Santos" required maxlength="100" pattern=".*\S.*" /></label><label>Email address <span>*</span><input v-model="form.email" name="email" type="email" autocomplete="email" placeholder="alex@company.com" required maxlength="254" /></label></div>
        <label>Company <span class="optional">(optional)</span><input v-model="form.company" name="company" autocomplete="organization" placeholder="Your company name" maxlength="150" /></label>
        <label>What can we help with? <span>*</span><select v-model="form.service" name="service" required><option disabled value="">Select a service</option><option v-for="service in services" :key="service.id" :value="service.id">{{ service.title }}</option><option value="unsure">I’d like help figuring it out</option></select></label>
        <label>A little about your project <span>*</span><textarea v-model="form.message" name="message" rows="4" placeholder="What would you like to build, improve, or solve?" required minlength="15" maxlength="2000" @input="event => event.target.setCustomValidity('')"></textarea></label>
        <button class="button form-submit" type="submit">Open email app <Icon name="arrow-up" :size="19" /></button><p class="form-note"><Icon name="mail" :size="15" /> We’ll prepare an email with your brief. You review it and press send in your email app.</p>
      </form>
      <div v-else class="email-prepared" role="status"><span class="prepared-icon"><Icon name="mail" :size="28" /></span><h3>Your brief is ready.</h3><p>Complete your inquiry by sending the prepared email to <strong>{{ contactEmail }}</strong> in your email app.</p><a :href="emailLink" class="button">Open email again <Icon name="arrow-up" :size="18" /></a><button class="copy-brief" @click="copyBrief">Copy project brief</button><p v-if="copyStatus" class="copy-status" aria-live="polite">{{ copyStatus }}</p><textarea v-if="copyStatus.startsWith('Select')" :value="projectBrief" readonly rows="8" aria-label="Project brief to copy"></textarea><button class="edit-brief" @click="emailPrepared = false">← Back to your brief</button></div>
    </template>
  </dialog>
</template>
