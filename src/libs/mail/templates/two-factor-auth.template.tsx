import { Html } from '@react-email/html'
import { Heading, Body, Text } from '@react-email/components'
import * as React from 'react'
interface TwoFactorAuthTemplateProps {
	token: string
}
export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
	return (
		<Html>
			<Body>
				<Heading>Двухфакторная авторизация</Heading>
				<Text>
					Привет, ваш код двухфакторной аутенфикации{' '}
					<strong>{token}</strong>:
				</Text>
				<Text>Если не заправшивали, игнорируйте</Text>
			</Body>
		</Html>
	)
}
