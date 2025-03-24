import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Body } from '@react-email/body'
import { Heading } from '@react-email/heading'
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
