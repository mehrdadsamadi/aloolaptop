import { Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { CheckoutService } from './checkout.service';
import { StartCheckoutDto, VerifyCheckoutDto } from './dto/checkout.dto';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';

@Controller('checkout')
@ApiTags('Checkout')
@AuthDecorator()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('start')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  startCheckout(@Body() startCheckoutDto: StartCheckoutDto) {
    return this.checkoutService.startCheckout(startCheckoutDto);
  }

  @Post('verify')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  verifyPayment(@Body() verifyCheckoutDto: VerifyCheckoutDto) {
    return this.checkoutService.verify(verifyCheckoutDto);
  }
}
