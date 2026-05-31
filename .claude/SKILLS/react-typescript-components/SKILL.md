---
name: react-typescript-components
description: >
  Use this skill when creating, refactoring, or reviewing React components
  written in TypeScript. Triggers include: building new components or hooks,
  defining props/types/interfaces, handling async data fetching, managing
  local or global state, writing event handlers, composing context providers,
  or any task that produces or modifies .tsx / .ts files in a React project.
---

# React Component Patterns with TypeScript

This skill defines conventions for writing React components in TypeScript
projects. Rules here take priority over generic suggestions. Apply them
consistently regardless of component size or complexity.

---

## 1. 檔案與命名規範

| 對象 | 規則 | 範例 |
|---|---|---|
| 元件檔案 | PascalCase，副檔名 `.tsx` | `UserCard.tsx` |
| Hook 檔案 | camelCase，前綴 `use`，副檔名 `.ts` | `useUserProfile.ts` |
| 純工具函式 | camelCase，副檔名 `.ts` | `formatDate.ts` |
| 型別/介面檔 | camelCase，副檔名 `.ts` | `user.types.ts` |

```
components/
  UserCard/
    UserCard.tsx       ← 實作
```

---

## 2. 元件定義

使用具名 `function` 宣告，**不使用** `const` + arrow function：

```tsx
// ✅ 正確 (使用 Props 時)
interface Props {
  userId: string,
  onSelect: (userId: string) => void
}
export function UserCard(props: Props) {
  const { userId, onSelect} = props
  return <div>...</div>
}

// ❌ 避免（匿名 arrow 在 stack trace 較難追蹤）
export const UserCard = ({ userId }: Props) => {
  return <div>...</div>
}
```

**禁止 default export**（除 React Router / Next.js 的 route module 強制要求外）：

```tsx
// ✅
export function UserCard() { ... }

// ❌
export default function UserCard() { ... }
```

---

## 3. Props 型別定義

- 一律用 `interface`，非 `type alias`（extends 較直覺）
- Props interface 與元件同檔，放在 import 區塊下方
- 名稱格式：`{ComponentName}Props`

```tsx
// ✅ 正確
interface Props {
  userId: string
  name: string
  avatarUrl?: string                        // optional 用 ?
  onSelect: (userId: string) => void        // callback 明確標出參數型別
  children?: React.ReactNode                // slot pattern
}

// ❌ 避免
type Props = {
  userId: any
  cb: Function
}
```
---

## 4. TypeScript 型別使用原則

```tsx
// ✅ 用 union 取代 enum（tree-shakeable，可直接當值用）
type Status = 'idle' | 'loading' | 'success' | 'error'

// ✅ 用 object map 取代 switch/if-else 做對應
const STATUS_LABEL: Record<Status, string> = {
  idle:    '等待中',
  loading: '處理中',
  success: '成功',
  error:   '失敗',
}

// ✅ 用 unknown + type guard 取代 any
function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'code' in err
}

// ❌ 禁止
const data: any = fetchSomething()
```

**嚴格禁止項目：**
- `any`（用 `unknown` 再 narrow）
- Non-null assertion `!`（用 optional chaining 或 early return）
- `@ts-ignore` / `@ts-expect-error`（改正型別，不繞過）

---

## 5. Hooks 撰寫規範

### 自訂 Hook 結構

```ts
// useCounter.ts
interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
}

interface UseCounterReturn {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter({
  initialValue = 0,
  min = -Infinity,
  max = Infinity,
}: UseCounterOptions = {}): UseCounterReturn {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((c) => Math.min(c + 1, max))
  }, [max])

  const decrement = useCallback(() => {
    setCount((c) => Math.max(c - 1, min))
  }, [min])

  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset }
}
```

### useEffect 規則

```tsx
// ❌ 禁止：dependency array 留空騙過 linter
useEffect(() => {
  fetchUser(userId)
}, [])  // eslint-disable-line  ← 禁止這樣做
```

---

## 6. 條件渲染與列表渲染

```tsx
// ✅ 三元運算子（兩種情況）
{isLoading ? <Skeleton /> : <UserCard user={user} />}

// ✅ && 短路（只有一種情況，且值不為 0）
{hasError && <ErrorMessage message={error.message} />}

// ⚠️ 數字 0 會被渲染，改用明確 boolean
{count > 0 && <Badge count={count} />}   // ✅
{count && <Badge count={count} />}        // ❌ count=0 時會渲染 "0"

// ✅ 列表：key 用穩定的業務 id，不用 index
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}

// ❌ key 用 index（排序或篩選時會出錯）
{users.map((user, i) => (
  <UserCard key={i} user={user} />
))}
```

---

## 7. 事件處理

```tsx
// ✅ 從 event 參數直接取型別，不要手動標 React.MouseEvent
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
  onSelect(userId)
}

// ✅ inline handler 只在邏輯極短時使用
<button onClick={() => onSelect(userId)}>選取</button>

// ✅ 需要防抖的操作
const handleSearch = useCallback(
  debounce((keyword: string) => {
    setQuery(keyword)
  }, 300),
  []
)
```

## 9. Context Provider 模式

```tsx
// ✅ Context + custom hook 封裝，對外只暴露 hook
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// hook 內部自行 guard，外部不需要 null check
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

---

## 10. 禁止事項總覽

| 禁止 | 原因 | 替代方案 | 
|---|---|---|
| `any` | 破壞型別安全 | `unknown` + type guard |
| Non-null assertion `!` | 隱藏潛在 null | optional chaining `?.` |
| `default export` | 重構時名稱不一致 | named export |
| `enum` | 編譯產物冗餘 | union type + object map |
| `key={index}` | 列表狀態錯亂 | 穩定的業務 id |
| 空 dependency array 配合 eslint-disable | 掩蓋 stale closure | 正確填寫 deps 或 useRef |
| 元件內直接 `fetch()` | 難以測試與重用 | 封裝進 api 模組或 custom hook |