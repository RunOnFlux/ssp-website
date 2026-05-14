import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

function setup(trigger: React.ReactNode) {
  return render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>{trigger}</NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe('NavigationMenuTrigger', () => {
  it('renders the chevron indicator by default', () => {
    const { container } = setup(<NavigationMenuTrigger>Open</NavigationMenuTrigger>)
    const trigger = container.querySelector('button')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).not.toBeNull()
  })

  it('omits the chevron indicator when hideIndicator is true', () => {
    const { container } = setup(<NavigationMenuTrigger hideIndicator>Open</NavigationMenuTrigger>)
    const trigger = container.querySelector('button')
    expect(trigger).not.toBeNull()
    expect(trigger?.querySelector('svg')).toBeNull()
  })
})
