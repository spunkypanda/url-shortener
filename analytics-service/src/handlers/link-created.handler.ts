import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm'

import { LinkCreatedCommand } from '../commands/link-created.command';
import { RequestEntity } from 'src/request-log/request-log.entity';

CommandHandler(LinkCreatedCommand)
export class LinkCreatedHandler implements ICommandHandler<LinkCreatedCommand> {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
  ) {}

  async execute(command: LinkCreatedCommand) {
    const { urlId } = command;

    console.log('urlId:', urlId);
    const request = this.requestRepository.findOne();
    console.log('request:', request);
  }
}