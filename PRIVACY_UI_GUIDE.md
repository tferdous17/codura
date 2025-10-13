# Profile Privacy - UI/UX Guide

## Visual Design Examples

### 🎨 Privacy Badge

Located next to username in profile header:

```
┌─────────────────────────────────────┐
│  [Avatar]  Jane Doe                 │
│            @janedoe                  │
│            🌐 Public Profile         │  ← Green badge
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Avatar]  John Smith               │
│            @johnsmith                │
│            🔒 Private Profile        │  ← Orange badge
└─────────────────────────────────────┘
```

### 📊 Always Visible Elements

**Profile Header** - Same for both public and private:
```
┌──────────────────────────────────────────────┐
│  [Avatar]     Jane Doe                       │
│               @janedoe  🔒 Private Profile   │
│               Member since October 2024      │
│                                              │
│  Bio: Passionate about algorithms and CS    │
│                                              │
│  🎓 Stanford '25                             │
│  📍 San Francisco, CA                        │
│  💼 Software Engineer Intern                 │
│  🌐 Portfolio  💻 GitHub  💼 LinkedIn       │
│                                              │
│  #5      2,450     1,234      12 🔥         │
│  Rank    Points    Rating    Streak         │
└──────────────────────────────────────────────┘
```

**Stats Card** - Always visible:
```
┌──────────────────────────────────────┐
│  Problem Solving Stats               │
│                                      │
│  127 Total Solved                    │
│                                      │
│  [██████░░░░] 45 Easy    (45/100)   │
│  [████████░░] 60 Medium  (60/75)    │
│  [████░░░░░░] 22 Hard    (22/55)    │
│                                      │
│  Acceptance Rate: 87.3%              │
└──────────────────────────────────────┘
```

**Contribution Graph** - Always visible:
```
┌──────────────────────────────────────────────┐
│  📅 245 submissions in 2024                  │
│  Longest streak: 45 days • Current: 12 days │
│                                              │
│  [GitHub-style heatmap grid showing year]    │
│  ░░▓▓██░░░░▓▓▓██▓░░░░▓▓▓▓██▓▓▓░░           │
│  Activity levels shown with hover tooltips   │
└──────────────────────────────────────────────┘
```

### 🔒 Blurred Elements (Private Profiles)

**Submissions Section** - With blur overlay:
```
┌──────────────────────────────────────────────┐
│  Recent Submissions                          │
│                                              │
│  [Blurred submission list behind overlay]    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│                                              │
│       ╔════════════════════════════╗         │
│       ║    🔒                      ║         │
│       ║  Submissions are Private   ║         │
│       ║                            ║         │
│       ║  Connect with Jane to      ║         │
│       ║  view detailed activity    ║         │
│       ║                            ║         │
│       ║  [Send Connection Request] ║         │
│       ║  [Explore Problems]        ║         │
│       ╚════════════════════════════╝         │
└──────────────────────────────────────────────┘
```

**Achievements Section** - Top 3 visible, rest blurred:
```
┌──────────────────────────────────────┐
│  🏆 Achievements (15)                │
│  Latest: Problem Solving Master      │
│                                      │
│  ┌────────────────────────────┐     │
│  │ 🔥 First Submission         │     │
│  │ Submit your first solution  │     │
│  │ Oct 15, 2024          ✓     │     │
│  └────────────────────────────┘     │
│                                      │
│  ┌────────────────────────────┐     │
│  │ ⚡ 5 Day Streak             │     │
│  │ Solve problems 5 days...    │     │
│  │ Oct 20, 2024          ✓     │     │
│  └────────────────────────────┘     │
│                                      │
│  ┌────────────────────────────┐     │
│  │ 💯 100 Problems Solved      │     │
│  │ Reach 100 total solved...   │     │
│  │ Nov 12, 2024          ✓     │     │
│  └────────────────────────────┘     │
│                                      │
│  [Blurred achievement cards]         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░           │
│       ╔════════════════════╗         │
│       ║    🔒              ║         │
│       ║  12 More           ║         │
│       ║  Achievements      ║         │
│       ║  Locked            ║         │
│       ║                    ║         │
│       ║  Connect with Jane ║         │
│       ║  to view all 15    ║         │
│       ║                    ║         │
│       ║  [Connect]         ║         │
│       ╚════════════════════╝         │
└──────────────────────────────────────┘
```

## 🎨 Color Scheme

### Privacy Badge Colors:
- **Public**: Green (#22c55e)
  - Background: `bg-green-500/10`
  - Text: `text-green-600 dark:text-green-400`
  - Border: `border-green-500/20`

- **Private**: Orange (#f97316)
  - Background: `bg-orange-500/10`
  - Text: `text-orange-600 dark:text-orange-400`
  - Border: `border-orange-500/20`

### Blur Overlay:
- Blur: `blur-md` (8px)
- Opacity: `opacity-40`
- Background: `bg-gradient-to-b from-background/60 via-background/80 to-background/60`
- Backdrop: `backdrop-blur-sm`

### Lock Icon Container:
- Size: 64px × 64px
- Background: `bg-gradient-to-br from-brand/20 to-purple-500/20`
- Ring: `ring-4 ring-background/50`
- Shadow: `shadow-lg`

## 🎯 Interaction States

### Privacy Blur Overlay:
1. **Default State**: Content blurred at 40% opacity
2. **Overlay Visible**: Glassmorphic card with lock icon
3. **Hover on Button**: Brand color intensifies, slight scale up
4. **Click**: Would trigger connection system (future feature)

### Privacy Badge:
- Non-interactive (display only)
- Subtle glow effect matching badge color
- Consistent sizing: `text-xs` with padding

## 📱 Responsive Behavior

### Mobile (< 768px):
- Privacy badge stacks below username
- Blur overlay messages remain centered
- Buttons stack vertically in overlay
- Contribution graph scrolls horizontally

### Tablet (768px - 1024px):
- Privacy badge inline with username
- Full blur overlay with side-by-side buttons
- Stats cards in 2-column grid

### Desktop (> 1024px):
- All elements at full width
- Blur overlays with comfortable padding
- Optimal button sizing

## ✨ Animation & Transitions

### Privacy Badge:
```css
- Fade in: 200ms ease
- No hover effects (informational only)
```

### Blur Overlay:
```css
- Blur transition: 300ms ease-in-out
- Overlay fade: 200ms ease
- Button hover scale: scale(1.05)
- Button shadow growth: 300ms ease
```

### Contribution Graph:
```css
- Maintains default ActivityCalendar animations
- Hover tooltips: instant display
- No privacy-related animation changes
```

## 🔄 State Flow

```
User lands on profile
    ↓
Is viewer the profile owner?
    ├─ YES → Show full profile (no restrictions)
    └─ NO → Check is_public field
              ├─ TRUE → Show full profile
              └─ FALSE → Apply privacy restrictions
                         ├─ Show profile header ✓
                         ├─ Show all stats ✓
                         ├─ Show contribution graph ✓
                         ├─ Blur submissions 🔒
                         ├─ Show top 3 achievements ✓
                         └─ Blur remaining achievements 🔒
```

## 💡 User Experience Goals

1. **Clarity**: Users immediately understand what's private
2. **Discoverability**: Enough information to assess expertise
3. **Motivation**: Clear path to unlock (connection)
4. **Professional**: Matches portfolio/networking expectations
5. **No Frustration**: Blur is informative, not annoying

## 🎭 Example Scenarios

### Scenario 1: Recruiter views private profile
✅ Sees: Stats (127 problems solved), contribution graph (consistent activity)
✅ Understands: Skilled developer with strong consistency
🔒 Can't see: Specific problems solved, all achievements
💡 Action: Encouraged to connect or reach out

### Scenario 2: Student views peer's private profile  
✅ Sees: University, graduation year, top 3 achievements
✅ Understands: Fellow student with similar goals
🔒 Can't see: Full submission history
💡 Action: Send connection request to collaborate

### Scenario 3: Anonymous visitor (no login)
✅ Sees: Full public profile information
✅ Can: Share profile link, view stats
🔒 Can't: View private sections
💡 Action: Explore public content, consider signing up

---

**Design Philosophy**: *"Show enough to impress, hide enough to respect privacy, blur instead of blocking to maintain engagement."*

