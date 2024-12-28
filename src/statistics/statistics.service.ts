import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import PostEntity from '../post/entity/post.entity'
import { ILike, Not, Repository } from 'typeorm'
import { User } from '../user/entity/user.entity'
import { CourseEntity } from '../course/entity/course.entity'
import { SectionEntity } from '../section/entity/section.entity'
import { UserRole } from '../constants/contants'
import { PostStatusEnum } from '../post/enum/PostStatus.enum'
import { StatusCourseEnum } from 'src/course/enum/status_course.enum'

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(CourseEntity)
		private readonly courseEntityRepository: Repository<CourseEntity>,
		@InjectRepository(PostEntity)
		private readonly postEntityRepository: Repository<PostEntity>,
		@InjectRepository(SectionEntity)
		private readonly sectionEntityRepository: Repository<SectionEntity>
	) {}

	async globalSearch(text: string, user: User) {
		if (user.role === UserRole.SUPER_ADMIN) {
			const posts = await this.postEntityRepository.find({
				where: { name: ILike(`%${text}%`) }
			})

			const courses = await this.courseEntityRepository.find({
				where: {
					name: ILike(`%${text}%`)
				}
			})

			return {
				courses: courses,
				posts: posts
			}
		}

		const posts = await this.postEntityRepository.find({
			where: { name: ILike(`%${text}%`), user: { id: user.id } }
		})

		const courses = await this.courseEntityRepository.find({
			where: {
				name: ILike(`%${text}%`),
				user: { id: user.id }
			}
		})

		return {
			courses: courses,
			posts: posts
		}
	}

	async getStatistics(userId: string) {

		const currentUser = await this.userRepository.findOne({where:{id: userId}})

		if(!currentUser) {
			throw new BadRequestException("Пользователь не найден!")
		}

		const courseCount =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.courseEntityRepository.count()
				: await this.courseEntityRepository.count({
						where: { user: { id: userId } }
					})

		const postCount =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.postEntityRepository.count()
				: await this.postEntityRepository.count({
						where: { user: { id: userId } }
					})

		const publishPosts =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.postEntityRepository.count({
						where: {
							is_publish: true
						}
					})
				: await this.postEntityRepository.count({
						where: {
							is_publish: true,
							user: { id: userId }
						}
					})

		const newPosts =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.postEntityRepository.count({
						where: {
							status: PostStatusEnum.NEW
						}
					})
				: await this.postEntityRepository.count({
						where: {
							user: { id: userId },
							status: PostStatusEnum.NEW
						}
					})

		const inProcessingPosts =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.postEntityRepository.count({
						where: {
							status: PostStatusEnum.IN_PROCESSING
						}
					})
				: await this.postEntityRepository.count({
						where: {
							user: { id: userId },
							status: PostStatusEnum.IN_PROCESSING
						}
					})

		const rejectPosts =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.postEntityRepository.count({
						where: {
							status: PostStatusEnum.REJECT
						}
					})
				: await this.postEntityRepository.count({
						where: {
							user: { id: userId },
							status: PostStatusEnum.REJECT
						}
					})

		const publishCourse =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.courseEntityRepository.count({
						where: {
							status: StatusCourseEnum.ACTIVE
						}
					})
				: await this.courseEntityRepository.count({
						where: {
							status: StatusCourseEnum.ACTIVE,
							user: { id: userId }
						}
					})

		const newCourse =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.courseEntityRepository.count({
						where: {
							status: StatusCourseEnum.NEW
						}
					})
				: await this.courseEntityRepository.count({
						where: {
							user: { id: userId },
							status: StatusCourseEnum.NEW
						}
					})

		const inProcessingCourse =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.courseEntityRepository.count({
						where: {
							status: StatusCourseEnum.IN_PROCESSING
						}
					})
				: await this.courseEntityRepository.count({
						where: {
							user: { id: userId },
							status: StatusCourseEnum.IN_PROCESSING
						}
					})

		const rejectCourse =
		currentUser.role === UserRole.SUPER_ADMIN
				? await this.courseEntityRepository.count({
						where: {
							status: StatusCourseEnum.REJECTED
						}
					})
				: await this.courseEntityRepository.count({
						where: {
							user: { id: userId },
							status: StatusCourseEnum.REJECTED
						}
					})

		const countUsers = await this.userRepository.count({
			where: {
				role: Not(UserRole.SUPER_ADMIN)
			}
		})

		const resData = {
			courseCountPublish:
				courseCount !== 0
					? ((publishCourse / courseCount) * 100).toFixed(2)
					: 0,
			courseCountNew:
				courseCount !== 0
					? ((newCourse / courseCount) * 100).toFixed(2)
					: 0,
			courseCountIsProcessing:
				courseCount !== 0
					? ((inProcessingCourse / courseCount) * 100).toFixed(2)
					: 0,
			courseCountReject:
				courseCount !== 0
					? ((rejectCourse / courseCount) * 100).toFixed(2)
					: 0,
			postCount: postCount,
			postsCountPublish:
				postCount !== 0
					? ((publishPosts / postCount) * 100).toFixed(2)
					: 0,
			postsCountNew:
				postCount !== 0 ? ((newPosts / postCount) * 100).toFixed(2) : 0,
			postsCountIsProcessing:
				postCount !== 0
					? ((inProcessingPosts / postCount) * 100).toFixed(2)
					: 0,
			postsCountReject:
				postCount !== 0
					? ((rejectPosts / postCount) * 100).toFixed(2)
					: 0
		}

		if(currentUser.role === UserRole.SUPER_ADMIN) {
			resData['countUser'] = countUsers
		}

		return resData
	}
}
