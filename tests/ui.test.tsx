import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '@/lib/types'
import { HomePage } from '@/pages/HomePage'
import { TrainPage } from '@/pages/PracticePages'
import { ProgressProvider } from '@/state/ProgressContext'

function renderHome() {
  return render(
    <ProgressProvider>
      <HashRouter>
        <HomePage />
      </HashRouter>
    </ProgressProvider>,
  )
}

describe('início sem dados', () => {
  beforeEach(() => localStorage.clear())

  it('mostra o estado inicial sem taxa de acerto inventada', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: /apostila inteira/i })).toBeInTheDocument()
    expect(screen.getByText(/você ainda não respondeu questões/i)).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('oferece continuar a leitura', () => {
    renderHome()
    const links = screen.getAllByRole('link', { name: /começar pelo capítulo 1/i })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '#/ler/chapter-01')
  })
})

describe('treino de questão múltipla', () => {
  beforeEach(() => localStorage.clear())

  it('exige a quantidade de alternativas antes de revelar o gabarito', async () => {
    const user = userEvent.setup()
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/praticar/treino?q=Q18']}>
          <Routes>
            <Route path="/praticar/treino" element={<TrainPage />} />
          </Routes>
        </MemoryRouter>
      </ProgressProvider>,
    )
    await user.click(screen.getByRole('button', { name: /começar treino/i }))
    const send = screen.getByRole('button', { name: /enviar resposta/i })
    expect(send).toBeDisabled()
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(4)
    await user.click(boxes[0]!)
    expect(send).toBeDisabled()
    expect(screen.queryByText(/gabarito/i)).not.toBeInTheDocument()
    await user.click(boxes[1]!)
    expect(send).toBeEnabled()
    await user.click(send)
    expect(screen.getByText(/gabarito/i)).toBeInTheDocument()
  })
})
