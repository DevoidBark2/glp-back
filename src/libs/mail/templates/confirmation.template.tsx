import { Html } from '@react-email/html'
import { Heading, Link, Body, Text } from '@react-email/components'
import * as React from 'react'
interface ConfirmationTemplateProps {
	domain: string
	token: string
}
export function ConfirmationTemplate({
	domain,
	token
}: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	return (
		<Html>
			<Body>
				<Heading>Подтверждение почты</Heading>
				<Text>
					Привет, чтобы подвтерждить почту, пройдите по ссылке ниже:
				</Text>
				<Link href={confirmLink}>Подтвердить почту</Link>

				<Text>
					Эта ссылка десвтйительна 1 час, если это не вы, просто игнор
				</Text>
			</Body>
		</Html>
	)
}
